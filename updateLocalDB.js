import fetch from "node-fetch";
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { Anime } from './models/Anime.js';
import { Demographic } from './models/Demographic.js';
import { Genre } from './models/Genre.js';
import { Licensor } from './models/Licensor.js';
import { Producer } from './models/Producer.js';
import { Studio } from './models/Studio.js';
import { Theme } from './models/Theme.js';

/**
 * Runs multiple queries from a .sql file on the local database.
 * 
 * @param {Database} db - the local database
 * @param {string} sqlFilename - name of the .sql file being queried
 */
async function runMultipleQueries(db, sqlFilename) {
    let dataSql = fs.readFileSync(sqlFilename).toString()
        .replace(/\n/g, "")
        .split(';')
        .filter(n => n);

    dataSql.forEach(query => {
        db.run(query, err => {
            if (err)
                return console.error(err.message);
        });
    });
}

/**
 * Transfers entries pulled from the API page to the local database.
 * 
 * @param {Database} db - The local database
 * @param {object} page - the current page
 */
function updatePageInDB(db, page) {
    page['data'].forEach(animeData => {
        let anime = new Anime(animeData);
        let animePlaceholders = Object.values(anime).map(() => '?').join(',');
        let sqlQuery = `INSERT OR REPLACE INTO Anime(${Object.keys(anime)}) VALUES (${animePlaceholders})`;
        db.run(sqlQuery, Object.values(anime), err => {
            if (err) return console.error(err.message);
        });

        insertIntoRelationalTable('demographics', Demographic);
        insertIntoRelationalTable('genres', Genre);
        insertIntoRelationalTable('licensors', Licensor);
        insertIntoRelationalTable('producers', Producer);
        insertIntoRelationalTable('studios', Studio);
        insertIntoRelationalTable('themes', Theme);

        /**
         * Inserts one-to-many values of the Anime table to a separate table.
         * 
         * @param {string} tableName - the name of the table
         * @param {Object} Table  - the model object of the table
         */
        function insertIntoRelationalTable(tableName, Table) {
            let table = animeData[tableName].map(t => new Table(t, animeData['mal_id']));
            if (table != undefined && table.length > 0) {
                let placeholders = table.map(t => `(${Object.values(t).map(() => '?').join(',')})`).join(',');
                let sqlQuery = `DELETE FROM ${table[0].toString()} WHERE mal_id = ${animeData['mal_id']}`;
                db.run(sqlQuery, err => {
                    if (err) return console.error(err.message);
                });
                sqlQuery = `INSERT INTO ${table[0].toString()}(${Object.keys(table[0])}) VALUES ${placeholders}`;
                let values = Object.values(table).map(t => Object.values(t)).flat();
                db.run(sqlQuery, values, err => {
                    if (err) return console.error(err.message);
                });
            }
        }
    });
}

/**
 * Fetches the metadata from Jikan.API and updates the local database with that metadata.
 */
export async function fetchMetaData() {

    /**
     * Fetches data from the Jikan.moe /anime API at page n.
     * If a fetch fails (usually due to error 429), the fetch retries
     * itself for up to three times.
     * 
     * @param {number} n - the page number
     * @param {number} retries - the current number of retries left 
     * @returns {object} A JSON object containing data related to the successful response.
     */
    async function fetchRetry(n, retries = 3) {
        let url = `https://api.jikan.moe/v4/anime?page=${n}`;
        return await fetch(url)
            .then(res => {
                if (res.ok) return res.json();
                if (retries > 0)
                    return fetchRetry(n, retries - 1);
                throw new Error(res);
            })
            .catch(err => {
                if (retries > 0)
                    return fetchRetry(n, retries - 1);
                throw new Error(err);
            });
    }

    const db = new sqlite3.Database('./db/AnimeDB.db');

    await runMultipleQueries(db, './db/CreateAllTables.sql');

    let response = await fetch('https://api.jikan.moe/v4/anime')
        .then(x => x.json())
        .catch(err => console.log(err));
    let numPages = response.pagination.last_visible_page;

    for (let i = 1; i <= numPages; i++)
        await fetchRetry(i).then(resJSON => updatePageInDB(db, resJSON));

    db.close();
    console.log("Database updated.");
}
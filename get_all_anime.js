import fetch from "node-fetch";
import fs from 'fs';
import { Anime } from './models/Anime.js';
import { Demographic } from './models/Demographic.js';
import { Genre } from './models/Genre.js';
import { Licensor } from './models/Licensor.js';
import { Producer } from './models/Producer.js';
import { Studio } from './models/Studio.js';
import { Theme } from './models/Theme.js';
import sqlite3 from 'sqlite3';

var db = null;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Iterates through all of the pages of the Jikan.moe API and populates a
 * local database with the entries from these pages.
 */
async function retrieveAllAnime() {
    let firstPage = await getNthPageOfAnime(1);
    if (firstPage == undefined) return;
    appendAnimeDB(firstPage);

    var numPages = firstPage['pagination']['last_visible_page']

    for (let i = 2; i < numPages + 1; i++) {
        let nextPage = await getNthPageOfAnime(i);
        if (nextPage == undefined) return;
        appendAnimeDB(nextPage);
    }
}

/**
 * Uses a REST API GET request to fetch information relating to the nth page of
 * the Jikan.moe API.
 * 
 * @param {number} n - An integer parameter representing a page number
 * @returns {Object} A object representing a page of the anime API
 */
const getNthPageOfAnime = async (n) => {
    await sleep(1000 / 3);
    return await fetch("https://api.jikan.moe/v4/anime?" + new URLSearchParams({
        page: n
    }),
        {
            method: "GET"
        }).then((response) => {
            if (response.ok)
                return response.json()
            else
                throw Error(response.statusText);
        }).catch((error) => console.log(error));
}

/**
 * Transfers entries pulled from the API page to the local database.
 * 
 * @param {Object} A object representing a page of the anime API
 */
function appendAnimeDB(page) {
    page['data'].forEach(animeData => {
        let anime = new Anime(animeData);
        let animePlaceholders = Object.values(anime).map(() => '?').join(',');
        let sqlQuery = `INSERT OR IGNORE INTO Anime(${Object.keys(anime)}) VALUES (${animePlaceholders})`;
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
                let sqlQuery = `INSERT INTO ${table[0].toString()}(${Object.keys(table[0])}) VALUES ${placeholders}`;
                let values = Object.values(table).map(t => Object.values(t)).flat();
                db.run(sqlQuery, values, err => {
                    if (err) return console.error(err.message);
                });
            }
        }
    });
}

/**
 * Runs multiple queries from a .sql file.
 * 
 * @param {string} sqlFilename - name of the .sql file being queried
 */
async function runMultipleQueries(sqlFilename) {
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

const deleteUpdateDB = async () => {
    if (fs.existsSync('./db/AnimeDB-updated.db'))
        fs.unlinkSync('./db/AnimeDB-updated.db');
};

async function main() {
    db = new sqlite3.Database('./db/AnimeDB-updated.db');

    db.serialize(async () => {
        await runMultipleQueries('./db/CreateAllTables.sql');
        await retrieveAllAnime();
        db.close(() => {
            fs.rename('./db/AnimeDB-updated.db', './db/AnimeDB.db', err => {
                if (err)
                    return console.error(err.message);
            });
        });
    });

}

main();

process.on('exit', () => { deleteUpdateDB(); process.exit(); });
process.on('SIGINT', () => { deleteUpdateDB(); process.exit(); });
process.on('SIGUSR1', () => { deleteUpdateDB(); process.exit(); });
process.on('SIGUSR2', () => { deleteUpdateDB(); process.exit(); });
process.on('uncaughtException', () => { deleteUpdateDB(); process.exit(); });
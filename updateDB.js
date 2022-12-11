import fetch from "node-fetch";
import fs from 'fs';
import promise from 'bluebird';
import pgPromise from 'pg-promise';
import { Anime } from './models/Anime.js';
import { Demographic } from './models/Demographic.js';
import { Genre } from './models/Genre.js';
import { Licensor } from './models/Licensor.js';
import { Producer } from './models/Producer.js';
import { Studio } from './models/Studio.js';
import { Theme } from './models/Theme.js';

const options = {
    promiseLib: promise
};

const pgp = new pgPromise(options);

const connection = process.env.DATABASE_URI || {
    host: 'localhost',
    port: 5432,
    database: 'animedb'
};

/**
 * Transfers entries pulled from the API page to the PostgreSQL database.
 * 
 * @param {object} t -- database transaction
 * @param {object} page - the current page
 */
function updatePageInDB(db, page) {
    return db.tx(t1 => {
        let res = page['data'].map(animeData => {
            let anime = new Anime(animeData);
            let sql = fs.readFileSync('db/UpsertAnime.sql').toString().replace(/\n/g, " ");
            let queries = [t1.result(sql, Object.values(anime), r => r.rowCount)];
            let relationalTables = [Demographic, Licensor, Genre, Producer, Studio, Theme];
            queries.push(...relationalTables.map(rt => insertIntoRelationalTable(rt)).filter(i => typeof i !== 'undefined'));
            return queries;

            /**
             * Inserts one-to-many values of the Anime table to a separate table.
             * 
             * @param {Object} Table  - the model object of the table
             */
            function insertIntoRelationalTable(Table) {
                let propName = new Table().toString();
                let table = animeData[propName].map(t => new Table(t, animeData['mal_id']));
                if (table != undefined && table.length > 0) {
                    let i = 0;
                    let valuePlaceholders = table.map(t => `(${Object.values(t).map(() => `$${++i}`).join(',')})`).join(',');
                    let values = Object.values(table).map(t => Object.values(t)).flat();
                    let formattedValues = pgPromise.as.format(valuePlaceholders, values)
                    let sqlScript = table[0].getSQLScript();

                    let sql = fs.readFileSync(sqlScript).toString().replace(/\n/g, " ");
                    return t1.result(sql, [formattedValues, animeData['mal_id']], r => r.rowCount);
                }
            }
        }).flat();
        return t1.batch(res);
    }).then(data => {
        return data.filter(f => f).reduce((partialSum, a) => partialSum + a, 0);
    }).catch(error => {
        return console.error(error.message);
    });
}

/**
 * Fetches the metadata from Jikan.API and updates the PostgreSQL database with that metadata.
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

    let response = await fetch('https://api.jikan.moe/v4/anime')
        .then(x => x.json())
        .catch(err => console.log(err));
    let numPages = response.pagination.last_visible_page;

    const db = pgp(connection);

    await db.none(fs.readFileSync('db/CreateAllTables.sql').toString().replace(/\n/g, " "));

    await (async () => {
        let localOrPublic = process.env.DATABASE_URI ? "public" : "local";
        console.log('\x1b[33m%s\x1b[0m', `Updating ${localOrPublic} database...`)
        let sum = [];
        for (let i = numPages; i > 0; i--) {
            let pageSum = await fetchRetry(i).then(async resJSON => await updatePageInDB(db, resJSON));
            console.log(`Fetching page ${numPages-i+1}/${numPages} (${Math.round(((numPages-i+1)/numPages)*10000)/100}%) of '/anime': ${pageSum} records inserted/affected.`);
            sum.push(pageSum);
        }
        return sum.reduce((partialSum, a) => partialSum + a, 0);
    })().then(data => {
        db.none('VACUUM');
        console.log('\x1b[32m%s\x1b[0m', `Database updated: ${data} rows inserted/affected.`);
    }).finally(db.$pool.end);
}

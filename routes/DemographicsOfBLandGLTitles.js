import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let demographicsOfBLandGLTitlesRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    dataOutput = rows.reduce((result, { demographic }) => {
        if (!result[demographic]) {
            const genres = rows.reduce((g, { demographic: d, genre }) => d == demographic && !g.includes(genre) ? g.concat(genre) : g, []);
            const totalTitlesPerGenre = rows.reduce((t, { demographic: d, "# Titles in Genre": tInGenre }) => d == demographic && !t.includes(tInGenre) ? t.concat(tInGenre) : t, []);
            const titlesInDemographic = rows.reduce((tid, { demographic: d, "# Titles Genre Demographic": tInDemo }) => d == demographic && !tid.includes(tInDemo) ? tid.concat(tInDemo) : tid, []);
            const percentages = rows.reduce((p, { demographic: d, percentage }) => d == demographic && !p.includes(percentage) ? p.concat(percentage) : p, []);

            result[demographic] = { genres, totalTitlesPerGenre, titlesInDemographic, percentages };
        }

        return result;
    }, {});

    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sqlFilename = './db/select/GetBLAndGLDemographic.sql';
        let sql = fs.readFileSync(sqlFilename).toString().replace(/\n/g, " ");

        db.many(sql).then(rows => {
            resolve(callback(rows, data));
        }).catch(() => {
            resolve({});
        });
    });
}

function getData(data) {
    return new Promise((resolve, reject) => {
        querySqlData(readSqlDataToOutput, data).then(results => {
            resolve(results);
        });
    });
}

demographicsOfBLandGLTitlesRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

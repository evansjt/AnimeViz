import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let dailyModeBroadcastTimesPerAgeRatingRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    dataOutput = rows.reduce((result, { rating }) => {
        if (!result[rating]) {
            const daysofweek = rows.reduce((d, { dayofweek }) => d.includes(dayofweek) ? d : d.concat(dayofweek), []);
            const modetimes = rows.reduce((bt, { rating: r, "Mode Broadcast Time": broadtime }) => r == rating ? bt.concat(broadtime) : bt, []);

            result[rating] = { daysofweek: daysofweek, modetimes: modetimes };
        }

        return result;
    }, {});

    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sqlFilename = './db/GetDailyModeBroadcastTimesPerAgeRating.sql';
        let sql = fs.readFileSync(sqlFilename).toString().replace(/\n/g, " ");

        db.many(sql, [data.tz]).then(rows => {
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

dailyModeBroadcastTimesPerAgeRatingRoute.route("/").get((req, res) => {
    getData({ tz: 'UTC' }).then(results => res.send(results));
});

dailyModeBroadcastTimesPerAgeRatingRoute.route("/:tz").get((req, res) => {
    getData(req.params).then(results => res.send(results));
});

import fs from 'fs';
import express from 'express';
import promise from 'bluebird';
import pgPromise from 'pg-promise';

export let avgMemPerYrRoute = express();

const options = {
    promiseLib: promise
};

const pgp = new pgPromise(options);

const connection = process.env.DATABASE_URI || {
    host: 'localhost',
    port: 5432,
    database: 'animedb'
};
const db = pgp(connection);

function readSqlDataToOutput(rows, dataOutput) {
    rows.forEach(row => {
        let year = row["Year"];
        let mediaType = row["Media Type"];
        let avgMembers = row["Average Members"];

        if (!dataOutput.hasOwnProperty(mediaType)) {
            dataOutput[mediaType] = {
                "Years": [],
                "Average Members": []
            };
        }

        dataOutput[mediaType]["Years"].push(year);
        dataOutput[mediaType]["Average Members"].push(avgMembers);
    });
    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sql = fs.readFileSync('./db/GetAverageMembershipPerYear.sql').toString().replace(/\n/g, " ");

        db.many(sql).then(rows => {
            resolve(callback(rows, data));
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

avgMemPerYrRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

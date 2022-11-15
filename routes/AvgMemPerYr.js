import fs from 'fs';
import express from 'express';
import sqlite3 from 'sqlite3';

export let avgMemPerYrRoute = express();

var db = null;

function readSqlDataToOutput(rows, dataOutput) {
    rows.forEach((row) => {
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

        db.serialize(() => {
            db.all(sql, (err, rows) => {
                if (err) reject(err);
                resolve(callback(rows, data));
            });
        });
    });
}

function getData(data) {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database('./db/AnimeDB.db');
        querySqlData(readSqlDataToOutput, data).then(results => {
            resolve(results);
        });
        db.close();
    });
}

avgMemPerYrRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

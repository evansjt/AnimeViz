import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let avgMemPerYrRoute = express();

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
        let sql = fs.readFileSync('./db/select/GetAverageMembershipPerYear.sql').toString().replace(/\n/g, " ");

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

avgMemPerYrRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

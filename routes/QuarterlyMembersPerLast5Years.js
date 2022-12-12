import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let quarterlyMembersPerLast5YearsRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    rows.reduce((returnValue, row) => {
        if (!returnValue[row['Year']]) {
            returnValue[row['Year']] = {
                Season: [row['Season']],
                avgMembers: [row['Average Members']]
            };
        } else {
            returnValue[row['Year']]['Season'].push(row['Season']);
            returnValue[row['Year']]['avgMembers'].push(row['Average Members']);
        }
        return returnValue;
    }, dataOutput);
    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sql = fs.readFileSync('./db/select/GetQuarterlyMembersPerLast5Years.sql').toString().replace(/\n/g, " ");

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

quarterlyMembersPerLast5YearsRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

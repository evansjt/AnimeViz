import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let avgMemPerYrRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    rows.forEach(({ "Media Type": mediaType }) => {
        const years = rows.reduce((returnVal, { "Media Type": m, "Year": year }) => m === mediaType ? returnVal.concat(year) : returnVal, []);
        const avgMembers = rows.reduce((returnVal, { "Media Type": m, "Average Members": avg }) => m === mediaType ? returnVal.concat(avg) : returnVal, []);

        const titlesWithMaxMembers = rows.reduce((returnVal, { "Media Type": m, title, members, "Title Count": count, url }) => {
            if (m === mediaType) {
                returnVal.push({ title: title, maxMembers: members, outOf: count, url: url })
            }
            return returnVal;
        }, []);

        dataOutput[mediaType] = { years, avgMembers, titlesWithMaxMembers }
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
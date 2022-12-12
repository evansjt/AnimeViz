import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let ageRatingCompOfBLGenreRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    let unformattedOutput = [];
    rows.reduce((returnValue, row) => {
        if (!returnValue[row['Rating']]) {
            returnValue[row['Rating']] = {
                value: parseInt(row['# BL Anime titles']),
                topTitlesInGenre: [{ rank: parseInt(row['Rank']), url: row['url'], jpg: row['image_jpg'], title: row['Title'] }]
            };
        } else {
            returnValue[row['Rating']]['topTitlesInGenre'].push({ rank: parseInt(row['Rank']), url: row['url'], jpg: row['image_jpg'], title: row['Title'] });
        }
        return returnValue;
    }, dataOutput);
    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sql = fs.readFileSync('./db/select/GetTop10BLAnimePerAgeRating.sql').toString().replace(/\n/g, " ");

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

ageRatingCompOfBLGenreRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

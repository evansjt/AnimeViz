import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let ageRatingDistOfBLGenreRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    let unformattedOutput = [];
    rows.reduce((returnValue, row) => {
        if (!returnValue[row['Rating']]) {
            returnValue[row['Rating']] = {
                value: row['# BL Anime titles'],
                topBLTitleImage: row['image_jpg'],
                topTitlesInGenre: [{ rank: row['Rank'], url: row['url'], title: row['Title'] }]
            };
        } else {
            returnValue[row['Rating']]['topTitlesInGenre'].push({ rank: row['Rank'], url: row['url'], title: row['Title'] });
        }
        return returnValue;
    }, unformattedOutput);

    Object.keys(unformattedOutput).reduce((returnValue, row) => {
        returnValue[row] = {
            value: unformattedOutput[row].value,
            topBLTitleImage: unformattedOutput[row].topBLTitleImage,
            topTitlesInGenre: unformattedOutput[row].topTitlesInGenre,
            text: `<div style="display:flex;justify-content:center;padding-bottom:15px;"><img src="${unformattedOutput[row].topBLTitleImage}" alt="#1 BL of Age Rating" style="height:196px;"><ul style="padding-left:10px;margin-top:0px;list-style:none;text-align:left;">${unformattedOutput[row].topTitlesInGenre.map(t => t.rank == 1 ? `<li><b>#${t.rank}: <a target="_blank" href="${t.url}">${t.title}</a></b></li>` : `<li>#${t.rank}: <a target="_blank" href="${t.url}">${t.title}</a></li>`).join('')}</ul></div>`
        }
        return returnValue;
    }, dataOutput);
    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sql = fs.readFileSync('./db/GetTop10BLAnimePerAgeRating.sql').toString().replace(/\n/g, " ");

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

ageRatingDistOfBLGenreRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

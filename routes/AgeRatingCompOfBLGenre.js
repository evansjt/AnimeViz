import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let ageRatingCompOfBLGenreRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    let unformattedOutput = [];
    rows.reduce((returnValue, row) => {
        if (!returnValue[row['Rating']]) {
            returnValue[row['Rating']] = {
                value: row['# BL Anime titles'],
                topTitlesInGenre: [{ rank: row['Rank'], url: row['url'], jpg: row['image_jpg'], title: row['Title'] }]
            };
        } else {
            returnValue[row['Rating']]['topTitlesInGenre'].push({ rank: row['Rank'], url: row['url'], jpg: row['image_jpg'], title: row['Title'] });
        }
        return returnValue;
    }, unformattedOutput);

    Object.keys(unformattedOutput).reduce((returnValue, row) => {
        returnValue[row] = {
            value: unformattedOutput[row].value,
            topTitlesInGenre: unformattedOutput[row].topTitlesInGenre,
            text: `<div id="topBLAnime"><img src="${unformattedOutput[row].topTitlesInGenre[0].jpg}"><ul id="bl-list">${unformattedOutput[row].topTitlesInGenre.map(t => `<li onmouseover="$('#topBLAnime img').attr('src','${t.jpg}');">${t.rank == 1 ? '<b>' : ''}#${t.rank}: <a target="_blank" href="${t.url}">${t.title}</a>${t.rank == 1 ? '</b>' : ''}</li>`).join('')}</ul></div>`
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

ageRatingCompOfBLGenreRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let longestRunningTVAnimeSeriesRoute = express();

function readSqlDataToOutput(rows, dataOutput) {
    const animeTitles = rows.map(r => ({ title: r.Title, url: r.url, rank: `#${r.rank}`, episodesAired: r['# Episodes'], airespan: { daysAired: r['Time Aired'], airedFrom: new Date(r['Aired From']).toLocaleDateString(), airedTo: new Date(r['Aired To']).toLocaleDateString() } }));

    const minYear = rows.reduce((min, { 'Aired From': y }) => min === null || new Date(y).getFullYear() < min ? new Date(y).getFullYear() : min, null);
    const maxYear = rows.reduce((max, { 'Aired To': y }) => max === null || new Date(y).getFullYear() > max ? new Date(y).getFullYear() : max, null);

    let years = [];
    let yearQuarters = [];
    for (let i = minYear; i <= maxYear; i++) {
        years.push({ start: `1/1/${i}`, end: `12/31/${i}`, label: `${i}` });
        yearQuarters.push({ start: `1/1/${i}`, end: `3/31/${i}`, label: "Q1" });
        yearQuarters.push({ start: `4/1/${i}`, end: `6/31/${i}`, label: "Q2" });
        yearQuarters.push({ start: `7/1/${i}`, end: `9/31/${i}`, label: "Q3" });
        yearQuarters.push({ start: `10/1/${i}`, end: `12/31/${i}`, label: "Q4" });
    }

    dataOutput = { animeTitles, categories: [{ category: years }, { category: yearQuarters }] };

    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sqlFilename = './db/select/GetTop50LongestRunningTVAnime.sql';
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

longestRunningTVAnimeSeriesRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});
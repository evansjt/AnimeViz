import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let collaboratingLicensorsAndStudiosRoute = express();

function getAdjacencyMatrix(sources, targets, edgelist, srcname, tgtname) {
    let adjMat = Array.from(Array(sources.length), _ => Array(targets.length).fill(null));

    edgelist.forEach(edge => {
        let i = sources.indexOf(edge[srcname]);
        let j = targets.indexOf(edge[tgtname]);

        adjMat[i][j] = parseInt(edge.weight);
    });

    return adjMat;
}

function readSqlDataToOutput(rows, dataOutput) {
    const licensors = rows.reduce((l, { licensor }) => !l.includes(licensor) ? l.concat(licensor) : l, []).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const studios = rows.reduce((s, { studio }) => !s.includes(studio) ? s.concat(studio) : s, []).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const adjMat = rows.length === 0 ? {} : getAdjacencyMatrix(studios, licensors, rows, 'studio', 'licensor');
    dataOutput = { licensors, studios, adjMat };
    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sqlFilename = './db/GetCollaboratingLicensorsAndStudios.sql';
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

collaboratingLicensorsAndStudiosRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

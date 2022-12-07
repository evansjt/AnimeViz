import fs from 'fs';
import express from 'express';
import { db } from '../server.js';

export let collaboratingProducersRoute = express();

function getNodesAndEdges(arr) {
    let nodes = {};
    let edges = [];
    const maxRank = parseInt(arr[0]['max_rank']);

    arr.forEach(row => {
        let srcId = row['src'].toString();
        let tgtId = row['tgt'].toString();
        let src_collabs = parseInt(row['src_collabs']);
        let tgt_collabs = parseInt(row['tgt_collabs']);
        let weight = parseInt(row['weight']);

        edges.push({ data: { id: `${srcId}_${tgtId}`, source: srcId, target: tgtId, weight: weight, width: weight / 10, text: `${row['Source Producer']} + ${row['Target Producer']}: ${weight} collabs.` } });

        const checkIfNodeExists = (nodeId, collabs, label) => {
            if (!nodes[nodeId]) {
                let radius = collabs / 10;
                nodes[nodeId] = {
                    data: {
                        id: nodeId,
                        collabs: collabs,
                        radius: radius,
                        fontSize: radius / 4,
                        outlineWidth: radius / 50,
                        label: label,
                        text: `${label} collaborated with ${collabs} other producers`
                    }
                };
            }
        }

        checkIfNodeExists(srcId, src_collabs, row['Source Producer']);
        checkIfNodeExists(tgtId, tgt_collabs, row['Target Producer']);
    });

    return { elements: { nodes: Object.values(nodes), edges: edges }, maxRange: maxRank };
}

function readSqlDataToOutput(rows, dataOutput) {
    dataOutput = rows.length === 0 ? {} : getNodesAndEdges(rows);
    return dataOutput;
}

function querySqlData(callback, data) {
    return new Promise((resolve, reject) => {
        let sqlFilename = './db/GetAllCollaboratingProducers.sql';
        let sqlParams = [];
        if (data.n) {
            sqlFilename = './db/GetTopNthCollaboratingProducers.sql';
            sqlParams.push(data.n);
        }
        let sql = fs.readFileSync(sqlFilename).toString().replace(/\n/g, " ");

        db.many(sql, sqlParams).then(rows => {
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

collaboratingProducersRoute.route("/").get((req, res) => {
    getData({}).then(results => res.send(results));
});

collaboratingProducersRoute.route("/:n").get((req, res) => {
    getData(req.params).then(results => res.send(results));
});

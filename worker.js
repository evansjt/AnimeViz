import express from "express";
import { fetchMetaData } from "./updateDB.js";

const port = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, async () => {
    console.log('\x1b[36m%s\x1b[0m', "Worker application listening.....");
    while (true) {
        console.time("JikanAPI2animedb");
        await fetchMetaData();
        console.timeEnd("JikanAPI2animedb");
    }
});

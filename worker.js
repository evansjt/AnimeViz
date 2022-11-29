import express from "express";
import { fetchMetaData } from "./updateDB.js";

const port = process.env.PORT || 8080;

const app = express();

app.listen(port, async () => {
    console.log("Worker application listening.....");
    while (true) {
        await fetchMetaData();
    }
});

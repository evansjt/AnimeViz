import express from "express";
import path from 'path';
import promise from 'bluebird';
import pgPromise from 'pg-promise';
import {fileURLToPath} from 'url';
import { avgMemPerYrRoute } from './routes/AvgMemPerYr.js';
import { quarterlyMembersPerLast5YearsRoute } from './routes/QuarterlyMembersPerLast5Years.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    promiseLib: promise
};

const pgp = new pgPromise(options);

const connection = process.env.DATABASE_URI || {
    host: 'localhost',
    port: 5432,
    database: 'animedb'
};
export const db = pgp(connection);

const port = process.env.PORT || 8080;

const app = express();

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/avg-mem-per-yr", avgMemPerYrRoute);
app.use("/qtly-mem-per-lst5yrs", quarterlyMembersPerLast5YearsRoute);

if (port == null || port == "")
    port = 8080;

app.listen(port, () => console.log(`Server listening on port ${port}`));
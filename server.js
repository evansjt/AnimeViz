import express from "express";
import path from 'path';
import promise from 'bluebird';
import pgPromise from 'pg-promise';
import { fileURLToPath } from 'url';
import { avgMemPerYrRoute } from './routes/AvgMembersPerYr.js';
import { quarterlyMembersPerLast5YearsRoute } from './routes/QuarterlyMembersPerLast5Years.js';
import { ageRatingCompOfBLGenreRoute } from './routes/AgeRatingCompOfBLGenre.js';
import { collaboratingProducersRoute } from "./routes/CollaboratingProducers.js";

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
app.use("/age-rating-comp-of-bl-genre", ageRatingCompOfBLGenreRoute);
app.use("/collab-prods", collaboratingProducersRoute);
app.use("/collab-prods/:n", collaboratingProducersRoute);

if (port == null || port == "")
    port = 8080;

app.listen(port, () => console.log(`Server listening on port ${port}`));
import express from "express";
import path from 'path';
import promise from 'bluebird';
import pgPromise from 'pg-promise';
import { fileURLToPath } from 'url';
import { avgMemPerYrRoute } from './routes/AvgMembersPerYr.js';
import { quarterlyMembersPerLast5YearsRoute } from './routes/QuarterlyMembersPerLast5Years.js';
import { ageRatingCompOfBLGenreRoute } from './routes/AgeRatingCompOfBLGenre.js';
import { collaboratingProducersRoute } from "./routes/CollaboratingProducers.js";
import { dailyModeBroadcastTimesPerAgeRatingRoute } from "./routes/DailyModeBroadcastTimesPerAgeRating.js";
import { demographicsOfBLandGLTitlesRoute } from "./routes/DemographicsOfBLandGLTitles.js";
import { collaboratingLicensorsAndStudiosRoute } from "./routes/CollaboratingLicensorsAndStudios.js";

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
app.use("/daily-mode-bc-times-per-rating", dailyModeBroadcastTimesPerAgeRatingRoute);
app.use("/demographics-of-bl-gl-titles", demographicsOfBLandGLTitlesRoute);
app.use("/collab-lics-studs", collaboratingLicensorsAndStudiosRoute);

if (port == null || port == "")
    port = 8080;

app.listen(port, () => console.log(`Server listening on port ${port}`));
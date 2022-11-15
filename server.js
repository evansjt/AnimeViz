import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import { avgMemPerYrRoute } from './routes/AvgMemPerYr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT = 8080;

const app = express();

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/avg-mem-per-yr", avgMemPerYrRoute);

if (port == null || port == "")
    port = 8080;

app.listen(port, () => console.log(`Server listening on port ${port}`));
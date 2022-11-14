import express from "express";
import { getData } from './get_avg_membership_per_yr.js';

const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get("/avg_membership_per_yr", (req, res) => {
    getData({}).then(results => res.send(results));
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}

app.listen(port, () => {
    console.log("Server started successfully!");
});
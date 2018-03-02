const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require('cors');
const app = express();


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/somedb');

app.use(bodyParser.json(), cors());
routes(app);



app.use((err, req, res, next) => {
    // console.log("some req");
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(422).send({ error: err.message });
});

module.exports = app;
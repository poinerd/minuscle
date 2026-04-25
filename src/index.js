const express = require('express');
const app = express();
const routes = require('./routes');
const pool = require('./db');
// require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});



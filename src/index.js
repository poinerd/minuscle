require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors')
const app = express();
const routes = require('./routes');
const pool = require('./db');


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(3000, () => {
    console.log("Server running on port 3000"); 
});





































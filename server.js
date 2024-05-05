const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ConnectDb = require('./config/Database');
const { CreateEmigration, getAllEmigration, singleEmigration, deleteEmigration, downloadEmigration } = require('./controller/Controller');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();
const Port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// routes
app.get('/', (req, res) => {
    res.send("I am from Emigration");
});





// Listen to the app
ConnectDb();
app.listen(Port, () => {
    console.log(`Server is Running On Port Number ${Port}`);
});

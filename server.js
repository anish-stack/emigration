const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ConnectDb = require('./config/Database');
const { CreateEmigration } = require('./controller/Controller');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();
const Port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://emigration.onrender.com','demoemmigration.netlify.app','https://demoemmigration.netlify.app/','www.demoemmigration.netlify.app'],
  }));

// Create 'files' directory if it doesn't exist
const directory = './files';
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

// Define multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// Configure multer upload
const upload = multer({ storage: storage });
const uploadMultipleFiles = upload.fields([
    { name: 'passportImage', maxCount: 10 }, 
    { name: 'panCardImage', maxCount: 2 }, 
    { name: 'photo', maxCount: 2 }
]);

// routes
app.get('/', (req, res) => {
    res.send("I am from Emigration");
});

app.post('/create-emigration', uploadMultipleFiles, CreateEmigration);

// Listen to the app
ConnectDb();
app.listen(Port, () => {
    console.log(`Server is Running On Port Number ${Port}`);
});

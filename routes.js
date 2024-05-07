// routes.js
const multer = require('multer');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { CreateEmigration, getAllEmigration, singleEmigration, deleteEmigration,findByUciNumber, downloadEmigration } = require('./controller/Controller'); // Import your controller functions
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
    { name: 'photo', maxCount: 2 },
    { name: 'VisaAttached', maxCount: 2 },
]);

router.post('/create-emigration', uploadMultipleFiles, CreateEmigration);
router.get('/get-emigration', getAllEmigration);
router.get('/get-single-emigration/:id', singleEmigration);
router.delete('/delete-emigration/:id', deleteEmigration);
router.get('/download-emigration', downloadEmigration);
router.get('/get-emigration-by-uci/:uci', findByUciNumber);


module.exports = router;

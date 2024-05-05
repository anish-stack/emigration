const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const ConnectDb = require('./config/Database')
const { CreateEmigration } = require('./controller/Controller')
dotenv.config()
const app = express()
const Port = process.env.PORT
const multer = require('multer')

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// routes
app.get('/', (req, res) => {
    res.send("i am from Emigration")
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })
const uploadMultipleFiles = upload.fields([{ name: 'passportImage', maxCount: 10 }, { name: 'panCardImage', maxCount: 2 }, { name: 'photo', maxCount: 2 }])


app.post('/create-emigration',uploadMultipleFiles, CreateEmigration)
//listen app
ConnectDb()
app.listen(Port, () => {
    console.log(`Server is Running On Port Number ${Port}`)
})

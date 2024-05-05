const mongoose = require('mongoose')

const ConnectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGOURL)
        console.log('Database is connected sucessfull')
    } catch (error) {
        console.log(error)
    }
}
module.exports = ConnectDb
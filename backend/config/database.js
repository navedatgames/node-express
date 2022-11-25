const mongoose  = require('mongoose');

const connectDB = ()=>{
    mongoose.connect(process.env.DB_URL).then((data)=>{
        console.log(`connected to database with server : ${data.connection.port}`)
    })
}

module.exports = connectDB;

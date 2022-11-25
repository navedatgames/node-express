const app = require('./app');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

// uncaught error
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    process.exit(1);
})
// config env variables
dotenv.config({path:'backend/config/.env'})

// connect to mongodb
connectDB();


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}/`)
})

// // Unhandled promise rejection when a Promise is rejected
// process.on("unhandledRejection",(err)=>{
//     console.log(`Error: ${err.message}`);
//     console.log("Server is crashed due to unhandled rejection");

//     server.close(()=>{
//         process.exit(1);
//     })
// })
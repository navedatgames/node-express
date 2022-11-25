const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
// import Routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');

app.use('/api/v1/',product);
app.use('/api/v1',user);
app.use('/api/v1',order);

app.use(errorMiddleware);

module.exports = app;
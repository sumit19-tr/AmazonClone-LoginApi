const express = require("express");
const app = express();

const db = require('./db');
let dotenv = require("dotenv");
dotenv.config();
// let port = process.env.PORT || 9041;
const port = 9091;
const cors = require('cors');
app.use(cors());

const cartController =require('./Controller/cartController');
app.use('/api/auth',cartController);

const LoginRounter = require('./Controller/AuthController');
app.use('/api/auth',LoginRounter);

app.listen(port,()=>{
    console.log(`Listing to port ${port}`);
})

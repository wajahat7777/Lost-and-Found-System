//Requiring the libraries used
const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const app=express();
const LFMSRouters=require('./routes/lfmsRouters');
const connectDB=require('./database.js');
app.use(express.json());
app.use(cors());
dotenv.config();

connectDB();


app.use('/api/lfms/',LFMSRouters);
module.exports=app;
//Requiring the libraries used
const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const app=express();
const lfsmRoutes=require('./routes/lfsmRoutes.js');
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/api/lfsm/',lfsmRoutes);

//connecting to MongoDB database
mongoose.connect('mongodb+srv://AhmadAqeel:lfsmDataBase39.43.182.86@clusterforlfms.xn5ai.mongodb.net/?retryWrites=true&w=majority&appName=clusterForLFMS')
.then( ()=>{
    console.log('Connected to database');
}
)
.catch(()=>{
    console.log('Failed to connect to database');
});
module.exports=app;
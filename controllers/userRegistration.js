
const User=require('../models/UserRegModel.js');

const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

exports.registerUser=async(req,res)=>{
    try
     {
      const newUser=await User.create(req.body);
      console.log('Recepient Email : ', req.body.Email);
     
      //defining a token  
         const token=jwt.sign(
           { firstName:newUser.FirstName,secondName:newUser.SecondName,UserName:newUser.UserName,Email:newUser.Email,Number:newUser.Number},
            '22I-1134',
            {expiresIn:'2h'}
     );
         return res.status(200).json({
           newUser,
            token
         });
       
    } 
    catch (error) 
    {
        console.log('Unable to register ',error); 
        res.status(500).json({error}); 
    }
}

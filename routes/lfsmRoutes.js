const express=require('express');
const{registerUser}=require('../controllers/userRegistration.js');
const router=express.Router();


//router to register user
router.post('/register',registerUser);




module.exports=router;
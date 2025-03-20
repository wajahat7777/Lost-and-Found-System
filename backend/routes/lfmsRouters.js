const express=require('express');
const{registerUser,signInUser,userVerification}=require('../controllers/userSignUp');
const{postLostItem}=require('../controllers/lostItemPost.js');
const{postFoundItem}=require('../controllers/foundItemPost.js');
const{searchItems}=require('../controllers/searchItems.js');
const router=express.Router();

//User Story No:1
router.post('/register',registerUser);
router.post('/signIn',signInUser);
router.post('/verifyUser',userVerification);


//User Story No:2
router.post('/postLostItem',postLostItem);

//User Story No:3
router.post('/postFoundItem',postFoundItem);

//User Story No:4
router.get('/search',searchItems);

module.exports=router;
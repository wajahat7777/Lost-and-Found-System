const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const UserSchema=mongoose.Schema(
    {
    FirstName:{
        type:String,
        required:true
    },
    SecondName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    UserName:
    {
        type:String,
        required:true,
        unique:true
    },
    Number:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    Status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});
const User=mongoose.model('User',UserSchema);
module.exports=User;
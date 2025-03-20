const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
    FirstName: String,
    SecondName: String,
    Email: 
    {
        type: String,
        unique: true
    },
    UserName: String,
    Number: String,
    Password: String,
    secNum: Number,
    createdAt: { type: Date, default: Date.now, expires: 600 } // Expires in 10 minutes
});
const pendUser = mongoose.model('pendUser', pendingUserSchema);
module.exports = pendUser;

const User = require('../models/userRegModel.js');
const pendUser = require('../models/pendingUserModel.js');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'ahmadmirza9987@gmail.com',
        pass: 'fttm qqqn lzgr wmua'   // less secure app password
    }
});

async function sendVerificationMail(email, firstName, secondName, verCode) {
    await transporter.sendMail({
        from: 'ahmadmirza9987@gmail.com',
        to: email,
        subject: 'LFMS Account Verification',
        text: `Dear ${firstName} ${secondName}, Your account verification code is: ${verCode}`
    });
}

// Endpoint for log in
exports.signInUser = async (req, res) => {
    const { Email, Password } = req.body;
    console.log('Email: ' + Email);
    console.log('Password: ' + Password);
    
    try {
        const validEmailHolder = await User.findOne({ Email: Email.toLowerCase() });
        if (!validEmailHolder) {
            return res.status(401).json({ message: 'Email not found' });
        }

        const validPasswordHolder = await bcrypt.compare(Password, validEmailHolder.Password);
        if (!validPasswordHolder) {
            return res.status(401).json({ message: 'Password does not match' });
        }

        // Credentials matched
        const token = jwt.sign(
            { id: validEmailHolder._id, email: validEmailHolder.Email },
            '22I-1134',
            { expiresIn: '2h' }
        );

        console.log(`Successfully logged into your account`);
        return res.status(200).json({
            message: `Successfully logged into account registered on email: ${Email}`,
            token
        });

    } catch (error) {
        console.log('Unable to log in:', error);
        res.status(500).json({ message: error.message });
    }
};

// Endpoint for registering user
exports.registerUser = async (req, res) => {
    try {
        // Correct case-sensitive destructuring
        const { FirstName, SecondName, Email, UserName, Number, Password } = req.body;

        // Ensure required fields exist
        if (!Email || !Password) {
            return res.status(400).json({ message: "Email and Password are required." });
        }

        const lowerCaseEmail = Email.toLowerCase();  // Ensure case-insensitive email matching

        // Check if email is already registered
        const isUserExist = await User.findOne({ Email: lowerCaseEmail });
        if (isUserExist) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Generate verification code
        const secNum = Math.floor(10000 + Math.random() * 90000);
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Save pending user in DB
        await pendUser.create({
            FirstName,
            SecondName,
            Email: lowerCaseEmail,
            UserName,
            Number,
            Password: hashedPassword,
            secNum
        });

        // Send verification email
        await sendVerificationMail(lowerCaseEmail, FirstName, SecondName, secNum);

        return res.status(200).json({
            message: "Verification code sent. Please verify within 10 minutes.",
        });

    } catch (error) {
        console.log('Error in registration:', error);
        res.status(500).json({ message: error.message });
    }
};

// Endpoint for user verification
exports.userVerification = async (req, res) => {
    console.log('User verification endpoint called');
    console.log('Request body:', req.body);
    try {
        const { email, secNum } = req.body;
        // Check if user exists in pending collection
        const tempUser = await pendUser.findOne({ Email: email});
        console.log('Pending user found:', tempUser);
        if (!tempUser) {
            console.log('No pending user found for email:', email);
            return res.status(400).json({ message: "No verification request found or expired." });
        }
        // Compare verification codes
        console.log('Comparing codes:', tempUser.secNum, 'vs', secNum);
        if (tempUser.secNum !== parseInt(secNum)) {
            console.log('Verification code mismatch');
            return res.status(400).json({ message: "Invalid verification code." });
        }

        // Save user to actual database
        const newUser = await User.create({
            FirstName: tempUser.FirstName,
            SecondName: tempUser.SecondName,
            Email: tempUser.Email,
            Password: tempUser.Password,
            UserName: tempUser.UserName,
            Number: tempUser.Number,
            Status: 'active'  // Explicitly set status to active
        });

        // Generate token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.Email },
            '22I-1134',
            { expiresIn: '2h' }
        );

        // Remove from pending users
        await pendUser.deleteOne({ Email: email.toLowerCase() });

        return res.status(200).json({
            message: "Account verified successfully!",
            token
        });

    } catch (error) {
        console.log('Error in verification:', error);
        res.status(500).json({ message: error.message });
    }
};

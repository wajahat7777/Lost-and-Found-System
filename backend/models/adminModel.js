const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    }
});

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@admin.com',
    password: 'iamadmin'
};

// Static method to verify admin credentials
adminSchema.statics.verifyCredentials = async function(email, password) {
    return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
};

module.exports = mongoose.model('Admin', adminSchema); 
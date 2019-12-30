const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: [isEmail, 'invalid email']
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
});
module.exports = mongoose.model('User', userSchema);

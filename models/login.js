const mongoose = require('mongoose');
const { isEmail } = require('validator');

const loginSchema = mongoose.Schema({
    email: {
        type: String,
        validate: [isEmail, 'wrong password']
    },
    password: {
        type: String,
        required: [true, 'please enter a password']
    }
});


module.exports = mongoose.model('Login', loginSchema);
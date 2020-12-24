//Naming Convention for models are a Capital letter to start

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date, 
        deafulat: Date.now
    }
});

module.exports = Users = mongoose.model('user', UserSchema);

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    
    email: { type: String, unique: true },
    password: String,
    rapidID: String,
    usertype : String,
    created_at: String,
    userObject : Object,
    status: Array,
    otp: Number,
    encodedMail: String

});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });

mongoose.connect('mongodb://rpqb:rpqb123@ds131583.mlab.com:31583/digitalid', { useMongoClient: true });



module.exports = mongoose.model('user', userSchema);

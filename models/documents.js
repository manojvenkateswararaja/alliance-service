'use strict';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var Photo = mongoose.Schema({
    url: {
        type: String,
        length: 255
    },

    userid: String

});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rpqbci:rpqb123@ds163721.mlab.com:63721/commercialinsurance', {
    useMongoClient: true
});
module.exports = mongoose.model('files', Photo);

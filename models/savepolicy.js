'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const policySchema = mongoose.Schema({
    id: String,
    consignmentWeight: Number,
    consignmentValue: Number,
    
    modeofTransport: String,
    packingMode: String,
    consignmentType: String,
    contractType: String,
    policyType: String,
   
    invoiceNo: Number,
   


});


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rpqbci:rpqb123@ds163721.mlab.com:63721/commercialinsurance', {
    useMongoClient: true
});

module.exports = mongoose.model('savepolicy', policySchema);

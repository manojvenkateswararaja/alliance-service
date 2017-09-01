'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const policySchema = mongoose.Schema({
    id: String,
    consignmentWeight: Number,
    consignmentValue: Number,
    policyName: String,
    sumInsured: Number,
    premiumAmount: Number,
    modeofTransport: String,
    packingMode: String,
    consignmentType: String,
    contractType: String,
    policyType: String,
    email: String,
    policyHolderName: String,
    userType: String,
    invoiceNo: Number,
    policyIssueDate: String,
    policyEndDate: String,
    voyageStartDate: String,
    voyageEndDate: String


});


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rpqbci:rpqb123@ds163721.mlab.com:63721/commercialinsurance', {
    useMongoClient: true
});

module.exports = mongoose.model('savepolicy', policySchema);
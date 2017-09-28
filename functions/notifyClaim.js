'use strict';
// const bc_client = require('../blockchain_sample_client'); const bcrypt =
// require('bcryptjs');
var bcSdk = require('../fabcar/invoke.js');
var user = 'risabh.s';
var affiliation = 'fundraiser'; 
exports.notifyClaim = (policyno, claim_no, claim_title, claim_damagedetails, userid) => 
new Promise((resolve, reject) => {
    const claim_details = ({policyno: policyno, claim_no: claim_no, claim_title: claim_title, claim_damagedetails: claim_damagedetails, userid: userid});
    console.log("ENTERING THE CORE MODULE");
    bcSdk
        .notify_Claim({user: user, ClaimDetails: claim_details})
        .then(() => resolve({status: 201, message: 'claim notified Sucessfully !'}))
        .catch(err => {
            if (err.code == 11000) {
                reject({status: 409, message: 'some error !'});
            } else {
                console.log("error occurred" + err);
                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});

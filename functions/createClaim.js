'use strict';

//const bc_client = require('../blockchain_sample_client');
//const bcrypt = require('bcryptjs');
var bcSdk = require('../fabcar/invoke.js');
var user = 'risabh.s';
var affiliation = 'fundraiser';
//exports is used here so that registerUser can be exposed for router and blockchainSdk file
exports.createClaim = (claim_no, totaldamagevalue, totalclaimvalue, publicadjusterid) =>
    new Promise((resolve, reject) => {


        const claim_details = ({
            claim_no: claim_no,
            totaldamagevalue: totaldamagevalue,
            totalclaimvalue: totalclaimvalue,
            publicadjusterid: publicadjusterid
        });

        console.log("ENTERING THE createClaim from createClaim.js to blockchainSdk");

        bcSdk.createClaim({
                user: user,
                ClaimDetails: claim_details
            })



            .then(() => resolve({
                status: 201,
                message: 'claim value updated Sucessfully !'
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already updated claims !'
                    });

                } else {
                    console.log("error occurred" + err);

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            });
    });

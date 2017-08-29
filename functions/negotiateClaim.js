'use strict';

//const bc_client = require('../blockchain_sample_client');
//const bcrypt = require('bcryptjs');
var bcSdk = require('../fabcar/invoke.js');;
var user = 'risabh.s';
var affiliation = 'fundraiser';
//exports is used here so that registerUser can be exposed for router and blockchainSdk file
exports.negotiateClaim = (claim_no, negotiationamount, asperterm2B, id) =>
    new Promise((resolve, reject) => {


        const claim_details = ({
            claim_no: claim_no,
            negotiationamount: negotiationamount,
            asperterm2B: asperterm2B,
            id: id
        });

        console.log("ENTERING THE negotiateClaim from negotiateClaim.js to blockchainSdk");

        bcSdk.negotiateClaim({
                user: user,
                ClaimDetails: claim_details
            })



            .then(() => resolve({
                status: 201,
                message: 'claim  negotiated Sucessfully !'
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: ' claims already negotiated !'
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
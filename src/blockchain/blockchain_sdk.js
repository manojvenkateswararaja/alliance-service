/*eslint-env node */
//this file acctually acts as a wrapper around a the chaincode
//it directly sends the data which it receives from webservices to chaincode..and then the data is stored it in ledger
"use strict";

/**
@author: risabh sharma
@version: 3.0
@date: 04/02/2017
@Description: SDK to talk to blockchain using hfc
**/

var Promise = require('bluebird');
var config = require('config');
var logHelper = require('../logging/logging.js');
var logger = logHelper.getLogger('blockchain_sdk');
var validate = require('../utils/validation_helper.js');
var util = require('../utils/util.js');
var constants = require('../constants/constants.js');
var bcNetwork = require('../blockchain/blockchain_network.js');


var secure = true;
var retryLimit = 5;
var retryInterval = 2000;


/**
register a new user
**/
//function UserRegisteration receives all the data required for registeration from functions/register.js file 

function notify_Claim(params) {

    console.log("calling SDK for notify claim");
    return new Promise(function(resolve, reject) {
        var ClaimDetails;
        try {
            logHelper.logEntryAndInput(logger, 'notifyClaim', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'notifyClaim', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not notify claim. Invalid params'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'notifyClaim', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not notify claim. Invalid user'
                })
            }

            ClaimDetails = params.ClaimDetails;

            if (!validate.isValidJson(ClaimDetails)) {
                logHelper.logError(logger, 'notifyClaim', 'Invalid ClaimDetails');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not notify claim. Invalid json object'
                })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register
            //args: [UserDetails.name,UserDetails.email,UserDetails.phone,UserDetails.pan,UserDetails.aadhar,UserDetails.usertype,UserDetails.upi,UserDetails.passpin]})
            var reqSpec = getRequestSpec({
                functionName: "notifyClaim",
                args: [ClaimDetails.id, ClaimDetails.claim_no, ClaimDetails.claim_title, ClaimDetails.claim_damagedetails]
            });
            recursiveInvoke({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'notifyClaim', 'Successfully notified claim', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: ClaimDetails
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'notifyClaim', 'Could not notify claim', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not notify claim'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}


function createClaim(params) {

    console.log("calling SDK for update claim");
    return new Promise(function(resolve, reject) {
        var ClaimDetails;
        try {
            logHelper.logEntryAndInput(logger, 'createClaim', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'createClaim', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not update claim. Invalid params'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'createClaim', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not update claim. Invalid user'
                })
            }

            ClaimDetails = params.claim_details;

            if (!validate.isValidJson(ClaimDetails)) {
                logHelper.logError(logger, 'createClaim', 'Invalid ClaimDetails');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not update claim. Invalid json object'
                })
            }
            var reqSpec = getRequestSpec({
                functionName: "createClaim",
                args: [ClaimDetails.claim_no, ClaimDetails.totaldamagevalue, ClaimDetails.totalclaimvalue, ClaimDetails.publicadjusterid]
            });
            recursiveInvoke({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'createClaim', 'Successfully updated claim', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: ClaimDetails
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'createClaim', 'Could not update claim', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not update claim'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}

function rejectClaim(params) {

    console.log("calling SDK for reject claim");
    return new Promise(function(resolve, reject) {
        var ClaimDetails;
        try {
            logHelper.logEntryAndInput(logger, 'rejectClaim', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'rejectClaim', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not settle claim. Invalid params'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'rejectClaim', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not reject claim. Invalid user'
                })
            }

            ClaimDetails = params.claim_details;

            if (!validate.isValidJson(ClaimDetails)) {
                logHelper.logError(logger, 'rejectClaim', 'Invalid ClaimDetails');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not settle claim. Invalid json object'
                })
            }
            var reqSpec = getRequestSpec({
                functionName: "rejectClaim",
                args: [ClaimDetails.claim_no]
            });
            recursiveInvoke({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'rejectClaim', 'reject claim', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: ClaimDetails
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'rejectClaim', 'Could not reject claim', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not reject claim'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}



function examineClaim(params) {

    console.log("calling SDK for examine claim");
    return new Promise(function(resolve, reject) {
        var ClaimDetails;
        try {
            logHelper.logEntryAndInput(logger, 'examineClaim', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'examineClaim', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not examine claim. Invalid params'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'examineClaim', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not examine claim. Invalid user'
                })
            }

            ClaimDetails = params.claim_details;

            if (!validate.isValidJson(ClaimDetails)) {
                logHelper.logError(logger, 'examineClaim', 'Invalid ClaimDetails');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not examine claim. Invalid json object'
                })
            }
            var reqSpec = getRequestSpec({
                functionName: "ExamineClaim",
                args: [ClaimDetails.examinerid, ClaimDetails.claim_no, ClaimDetails.assesseddamagevalue, ClaimDetails.assessedclaimvalue]
            });
            recursiveInvoke({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'examineClaim', 'Successfully examined claim', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: ClaimDetails
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'examineClaim', 'Could not examine claim', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not examine claim'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}


function negotiateClaim(params) {

    console.log("calling SDK for negotiate claim");
    return new Promise(function(resolve, reject) {
        var ClaimDetails;
        try {
            logHelper.logEntryAndInput(logger, 'negotiateClaim', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'negotiateClaim', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not negotiate claim. Invalid params'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'negotiateClaim', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not negotiate claim. Invalid user'
                })
            }

            ClaimDetails = params.claim_details;

            if (!validate.isValidJson(ClaimDetails)) {
                logHelper.logError(logger, 'negotiateClaim', 'Invalid ClaimDetails');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not negotiate claim. Invalid json object'
                })
            }
            var reqSpec = getRequestSpec({
                functionName: "ClaimNegotiation",
                args: [ClaimDetails.id, ClaimDetails.claim_no, ClaimDetails.negotiationamount, ClaimDetails.asperterm2B]
            });
            recursiveInvoke({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'negotiateClaim', 'Successfully negotiated claim', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: ClaimDetails
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'negotiateClaim', 'Could not negotiate claim', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not negotiate claim'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}


function approveClaim(params) {

    console.log("calling SDK for approve claim");

   
    return new Promise(function(resolve, reject) {
        var ClaimDetails;
        try {
            logHelper.logEntryAndInput(logger, 'approveClaim', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'approveClaim', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not approve claim. Invalid params'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'approveClaim', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not approve claim. Invalid user'
                })
            }

            ClaimDetails = params.claim_details;

            if (!validate.isValidJson(ClaimDetails)) {
                logHelper.logError(logger, 'approveClaim', 'Invalid ClaimDetails');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not approve claim. Invalid json object'
                })
            }
            var reqSpec = getRequestSpec({
                functionName: "approveClaim",
                args: [ClaimDetails.claim_no]
            });
            recursiveInvoke({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'approveClaim', 'Successfully approved claim', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: ClaimDetails
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'approveClaim', 'Could not approve claim', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not approve claim'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}


function settleClaim(params) {

    console.log("calling SDK for settle claim");
    return new Promise(function(resolve, reject) {
        var ClaimDetails;
        try {
            logHelper.logEntryAndInput(logger, 'settleClaim', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'settleClaim', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not settle claim. Invalid params'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'settleClaim', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not settle claim. Invalid user'
                })
            }

            ClaimDetails = params.claim_details;

            if (!validate.isValidJson(ClaimDetails)) {
                logHelper.logError(logger, 'settleClaim', 'Invalid ClaimDetails');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not settle claim. Invalid json object'
                })
            }
            var reqSpec = getRequestSpec({
                functionName: "settleClaim",
                args: [ClaimDetails.claim_no]
            });
            recursiveInvoke({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'settleClaim', 'Successfully settled claim', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: ClaimDetails
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'settleClaim', 'Could not settle claim', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not settle claim'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}


//get claim details 
function fetchClaimlist(params) {
    console.log(params, 'data in params for query method')
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'fetch claim details', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'fetch claim details', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not fetch claim details. Invalid params'
                })
            }



            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'fetch claim details of user', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not fetch claim details. Invalid user'
                })
            }


            var getclaims = params.getclaims;
            if (!validate.isValidString(getclaims)) {
                logHelper.logError(logger, 'fetch claim details of user', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not fetch claim details. Invalid user'
                })
            }
            var reqSpec = getRequestSpec({
                functionName: 'readuser',
                args: [getclaims]
            });
            recursiveQuery({
                    requestSpec: reqSpec,
                    user: user
                })
                .then(function(resp) {
                    logHelper.logMessage(logger, 'fetched claim details', 'Successfully fetched claim details', resp.body);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: resp.body
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'getclaims', 'Could not fetch claims details', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not fetch claim details'
                    });

                });

        } catch (err) {
            logHelper.logError(logger, 'fetchclaimdetails', 'Could not fetch property ad ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not fetch claim details'
            });
        }
    });
}



/**
Generates the request object for invoke and query calls using hfc
**/
function getRequestSpec(params) {

    if (!validate.isValidJson(params)) {
        logHelper.logError(logger, 'getRequestSpec', 'Invalid params');
        throw new Error("Invalid params");
    }

    var chaincodeID = config['chaincode']['id']; //util.getUserDefinedProperty(constants['BLOCKCHAIN_CHAINCODE'])['id'];
    if (!validate.isValidString(chaincodeID)) {
        logHelper.logError(logger, 'getRequestSpec', 'Invalid chaincodeID');
        throw new Error("Invalid chaincodeID");
    }

    var functionName = params.functionName;
    if (!validate.isValidString(functionName)) {
        logHelper.logError(logger, 'getRequestSpec', 'Invalid function name');
        throw new Error("Invalid function name");
    }

    var args = []

    if (validate.isValidArray(params.args)) {
        args = params.args;
    }

    //     var attributes = ['username', 'role']

    //   if(validate.isValidArray(params.attributes)){
    //     attributes = params.attributes;


    var spec = {
        chaincodeID: chaincodeID,
        fcn: functionName,
        args: args
        //  attrs: attributes
    }

    return spec;
}


/**
Performs query operation on blockchain
**/
function doQuery(params) {
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'doQuery', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'doQuery', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not perform query. Invalid params'
                })
            }

            var requestSpec = params.requestSpec;
            if (!validate.isValidJson(requestSpec)) {
                logHelper.logError(logger, 'doQuery', 'Invalid requestSpec');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not perform query. Invalid requestSpec'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'doQuery', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not perform query. Invalid user'
                })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(user)
                .then(function(member) {

                    var tx = member.query(requestSpec);
                    tx.on('submitted', function() {
                        logHelper.logMessage(logger, 'doQuery', 'Transaction for query submitted');
                    });

                    tx.on('complete', function(data) {
                        try {
                            logHelper.logMessage(logger, 'doQuery', 'data in data.result ', data.result);
                            var buffer = new Buffer(data.result);
                            logHelper.logMessage(logger, 'doQuery', 'data in buffer.tostring ', buffer.toString());
                            var jsonResp = JSON.parse(buffer.toString());
                            return resolve({
                                statusCode: constants.SUCCESS,
                                body: jsonResp
                            });
                        } catch (err) {
                            logHelper.logError(logger, 'doQuery', 'Could not parse query response', err);
                            return reject({
                                statusCode: constants.INTERNAL_SERVER_ERROR,
                                body: 'Could not parse query response '
                            });
                        }
                    });

                    tx.on('error', function(err) {
                        logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
                        return reject({
                            statusCode: constants.INTERNAL_SERVER_ERROR,
                            body: 'Could not perform query '
                        });

                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not perform query '
                    });
                })

        } catch (err) {
            logHelper.logError(logger, 'doQuery', 'Could not perform query ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not perform query '
            });
        }
    });

}


/**
Performs invoke operation on blockchain
**/
function doInvoke(params) {
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logEntryAndInput(logger, 'doInvoke', params);

            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'doInvoke', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not perform invoke. Invalid params'
                })
            }

            var requestSpec = params.requestSpec;
            if (!validate.isValidJson(requestSpec)) {
                logHelper.logError(logger, 'doInvoke', 'Invalid requestSpec');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not perform invoke. Invalid requestSpec'
                })
            }

            var user = params.user;
            if (!validate.isValidString(user)) {
                logHelper.logError(logger, 'doInvoke', 'Invalid user');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not perform invoke. Invalid user'
                })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);


            chainAsync.getMemberAsync(user)
                .then(function(member) {

                    var tx = member.invoke(requestSpec);
                    tx.on('submitted', function(data) {
                        logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke submitted ', requestSpec);
                        return resolve({
                            statusCode: constants.SUCCESS,
                            body: data
                        });

                    });

                    tx.on('complete', function(data) {
                        logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke complete ', data);

                    });

                    tx.on('error', function(err) {
                        logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ', err);
                        return reject({
                            statusCode: constants.INTERNAL_SERVER_ERROR,
                            body: 'Could not perform invoke '
                        });

                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ', err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not perform invoke '
                    });
                })

        } catch (err) {
            logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ', err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not perform invoke '
            });
        }
    });

}

/*Performs register on Blockchain CA*/
function doRegister(params) {
    return new Promise(function(resolve, reject) {

        var username;
        try {
            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'registerUser', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not register user. Invalid params'
                })
            }

            username = params.username;
            if (!validate.isValidString(username)) {
                logHelper.logError(logger, 'registerUser', 'Invalid username');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not register user. Invalid username'
                })
            }

            var affiliation = params.affiliation;
            if (!validate.isValidString(affiliation)) {
                logHelper.logError(logger, 'registerUser', 'Invalid affiliation');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not register user. Invalid affiliation'
                })
            }

            var roles = params.roles;
            if (!validate.isValidArray(roles)) {
                roles = ['client'];
            }

            var enrollsecret
            var chain = bcNetwork.getChain();
            var reg = chain.getRegistrar();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    var memberAsync = Promise.promisifyAll(member);

                    var registrationRequest = {
                        enrollmentID: username,
                        attributes: [{
                                name: 'role',
                                value: affiliation
                            },
                            {
                                name: 'username',
                                value: username
                            }
                        ],
                        affiliation: 'group1',
                        registrar: reg,
                        roles: roles

                    };

                    return memberAsync.registerAsync(registrationRequest);
                })
                .then(function(enrollsec) {
                    logHelper.logMessage(logger, 'registerUser', 'Successfully registered user on blockchain: ' + username);
                    enrollsecret = enrollsec;
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: {
                            password: enrollsecret
                        }
                    });

                })
                .catch(function(err) {
                    logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: ' + username, err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not register user'
                    });
                })
        } catch (err) {
            logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: ' + username, err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });

}

/**
Enroll user with the Blockchain CA
**/
function doLogin(params) {
    return new Promise(function(resolve, reject) {

        try {
            logHelper.logMethodEntry(logger, 'doLogin');
            if (!validate.isValidJson(params)) {
                logHelper.logError(logger, 'doLogin', 'Invalid params');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not login user. Invalid params'
                })
            }

            var username = params.username;
            if (!validate.isValidString(username)) {
                logHelper.logError(logger, 'doLogin', 'Invalid username');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not login user. Invalid username'
                })
            }

            var password = params.password;
            if (!validate.isValidString(password)) {
                logHelper.logError(logger, 'doLogin', 'Invalid account');
                return reject({
                    statusCode: constants.INVALID_INPUT,
                    body: 'Could not login user. Invalid password'
                })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    var memberAsync = Promise.promisifyAll(member);
                    return memberAsync.enrollAsync(password);
                })
                .then(function(crypto) {
                    logHelper.logMessage(logger, 'doLogin', 'Successfully logged in user on blockchain: ' + username);
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: crypto
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'doLogin', 'Could not login user on blockchain: ' + username, err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not login user'
                    });
                });

        } catch (err) {
            logHelper.logError(logger, 'doLogin', 'Could not register user on blockchain: ' + username, err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not register user'
            });
        }
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveRegister(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doRegister(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveRegister', "Register Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            return recursiveRegister(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveLogin(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doLogin(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveLogin', "Login Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            return recursiveLogin(params);
        });
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveInvoke(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doInvoke(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retries Exhausted", err);
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retry " + params.retryCounter, err)
            return recursiveInvoke(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveQuery(params) {
    if (!validate.isValid(params.retryCounter)) {
        params.retryCounter = 0;
    } else {
        params.retryCounter = params.retryCounter + 1;
    }

    return doQuery(params).catch(function(err) {
        if (err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit) {
            logHelper.logError(logger, 'recursiveQuery', "Query Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function() {
            logHelper.logError(logger, 'recursiveQuery', "Query Retry " + params.retryCounter, err)
            return recursiveQuery(params);
        });
    });
}

function isUserRegistered(params) {
    return new Promise(function(resolve, reject) {
        try {
            logHelper.logMethodEntry(logger, 'isUserRegistered');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: member.isRegistered()
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status ' + username, err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not get user registration status'
                    });
                });
        } catch (err) {
            logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status ' + username, err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not get user registration status'
            });
        }
    })

}

function isUserEnrolled(params) {
    return new Promise(function(resolve, reject) {
        try {
            logHelper.logMethodEntry(logger, 'isUserEnrolled');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
                .then(function(member) {
                    return resolve({
                        statusCode: constants.SUCCESS,
                        body: member.isEnrolled()
                    });
                })
                .catch(function(err) {
                    logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status ' + username, err);
                    return reject({
                        statusCode: constants.INTERNAL_SERVER_ERROR,
                        body: 'Could not get user enrollment status'
                    });
                });
        } catch (err) {
            logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status ' + username, err);
            return reject({
                statusCode: constants.INTERNAL_SERVER_ERROR,
                body: 'Could not get user enrollment status'
            });
        }
    });

}

module.exports = {

    notify_Claim: notify_Claim,
    createClaim: createClaim,
    rejectClaim: rejectClaim,
    examineClaim: examineClaim,
    negotiateClaim: negotiateClaim,
    approveClaim: approveClaim,
    settleClaim: settleClaim,
    fetchClaimlist: fetchClaimlist,
    recursiveRegister: recursiveRegister,
    recursiveLogin: recursiveLogin,
    isUserEnrolled: isUserEnrolled,
    isUserRegistered: isUserRegistered
};

// This is just a sample script. Paste your real code (javascript or HTML) here.
//here only routing is done and if the ro
'use strict';

var crypto = require('crypto');
const jwt = require('jsonwebtoken');
var cors = require('cors');

var mongoose = require('mongoose');
var Photo = require('./models/documents');

var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


const register = require('./functions/register');
const registerpublicadjuster = require('./functions/registerpublicadjuster');
const login = require('./functions/login');

const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');

const notifyClaim = require('./functions/notifyClaim');
const createClaim = require('./functions/createClaim');
const rejectClaim = require('./functions/rejectClaim');
const examineClaim = require('./functions/examineClaim');
const negotiateClaim = require('./functions/negotiateClaim');
const approveClaim = require('./functions/approveClaim');
const settleClaim = require('./functions/settleClaim');
const publicAdjusterList = require('./functions/publicAdjusterList');
const date = require('date-and-time');

const fetchClaimlist = require('./functions/fetchClaimlist');


module.exports = router => {

    router.get('/', (req, res) => res.send("Welcome to commercial-insurance,please hit a service !"));
    router.post('/registerUser', cors(), (req, res) => {
        console.log("entering register function in functions");
        const firstname = req.body.firstname;
        console.log(firstname);
        const lastname = req.body.lastname;
        const email = req.body.email;
        console.log(email);
        const phone = req.body.phone;
        console.log(phone);
        const password = req.body.password;
        console.log(password);


        if (!firstname || !lastname || !email || !password || !phone) {

            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            register.registerUser(firstname, lastname, email, phone, password)

            .then(result => {

                res.setHeader('Location', '/users/' + email);
                res.status(result.status).json({
                    message: result.message,
                    ind: true
                })
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });

    router.post('/registerPublicAdjuster', cors(), (req, res) => {

        const liscenceid = req.body.liscenceid;
        console.log(liscenceid);
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        console.log(email);
        const phone = req.body.phone;
        console.log(phone);
        const password = req.body.password;
        console.log(password);


        if (!liscenceid || !firstname || !lastname || !email || !password || !phone) {

            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            registerpublicadjuster.registerPublicAdjuster(liscenceid, firstname, lastname, email, phone, password)

            .then(result => {

                res.setHeader('Location', '/users/' + email);
                res.status(result.status).json({
                    message: result.message,
                    ind: true
                })
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });

    router.post('/login', cors(), (req, res) => {

        const email = req.body.email;

        const password = req.body.password;
        const policyno = req.body.policyno;
        if (!email || !password || !email.trim()) {

            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            login.loginUser(email, password)

            .then(result => {
                if ('liscenceid' in result.users._doc) {

                    const token = jwt.sign(result, config.secret, {
                        expiresIn: 144000000
                    });
                    res.status(result.status).json({
                        message: result.message,
                        token: token,
                        usertype: "publicadjuster"
                    });

                } else if ('examinerid' in result.users._doc) {
                    const token = jwt.sign(result, config.secret, {
                        expiresIn: 144000000
                    });
                    res.status(result.status).json({
                        message: result.message,
                        token: token,
                        usertype: "examiner"
                    });
                } else if ('claimadjusterid' in result.users._doc) {
                    const token = jwt.sign(result, config.secret, {
                        expiresIn: 144000000
                    });
                    res.status(result.status).json({
                        message: result.message,
                        token: token,
                        usertype: "claimadjuster"
                    });
                } else {
                    const token = jwt.sign(result, config.secret, {
                        expiresIn: 144000000
                    });
                    res.status(result.status).json({
                        message: result.message,
                        token: token,
                        usertype: "insured"
                    });
                }


            })



            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });


    router.post('/testmethod', cors(), function(req, res) {
        const id = checkToken(req)
        console.log(id)
        res.send({
            "name": "risabh",
            "email": "rls@gmail.com"
        });
    });




    router.get('/users/:id', cors(), (req, res) => {

        if (checkToken(req)) {

            profile.getProfile(req.params.id)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({
                message: err.message
            }));

        } else {

            res.status(401).json({
                message: 'Invalid Token !'
            });
        }
    });

    router.put('/users/:id', cors(), (req, res) => {

        if (checkToken(req)) {

            const oldPin = req.body.password;
            const newPin = req.body.newPassword;

            if (!oldPin || !newPin || !oldPin.trim() || !newPin.trim()) {

                res.status(400).json({
                    message: 'Invalid Request !'
                });

            } else {

                password.changePassword(req.params.id, oldPassword, newPassword)

                .then(result => res.status(result.status).json({
                    message: result.message
                }))

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

            }
        } else {

            res.status(401).json({
                message: 'Invalid Token !'
            });
        }
    });

    router.post('/users/:id/password', cors(), (req, res) => {

        const email = req.params.id;
        const token = req.body.token;
        const newPassword = req.body.password;

        if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

            password.resetPasswordInit(email)

            .then(result => res.status(result.status).json({
                message: result.message
            }))

            .catch(err => res.status(err.status).json({
                message: err.message
            }));

        } else {

            password.resetPasswordFinish(email, token, newPassword)

            .then(result => res.status(result.status).json({
                message: result.message
            }))

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });




    router.post('/notifyClaim', cors(), (req, res) => {
        const id = "123";


        const claim_no1 = Math.floor(Math.random() * (1000 - 1)) + 1;
        const claim_no = claim_no1.toString();
        const claim_title = req.body.title;
        const claim_damagedetails = req.body.damagedetails;




        if (!claim_title || !claim_damagedetails || !claim_title.trim() || !claim_damagedetails.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            notifyClaim.notifyClaim(id, claim_no, claim_title, claim_damagedetails)
                .then(result => {


                    res.status(result.status).json({
                        status: result.status,
                        message: result.message
                    })
                })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    });




    router.get('/claim/Claimlist', (req, res) => {


        if (checkToken(req)) {

            fetchClaimlist.fetch_Claim_list({
                "user": "risabh",
                "getclaims": "getclaims"
            })

            .then(function(result) {
                var daysDifference = [];
                var claimDifference = [];
                for (let i = 0; i < result.claimlist.claimlist.length; i++) {

                    if (result.claimlist.claimlist[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                        var date1 = new Date(result.claimlist.claimlist[i].claimnotifieddate);
                        console.log("date1" + date1);
                        var date2 = new Date(result.claimlist.claimlist[i].claimsettleddate);
                        console.log("date1" + date2);
                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        console.log("diffDays" + diffDays);
                        daysDifference.push(diffDays)
                        console.log("daysDifference" + daysDifference);
                        var total = 0;
                        for (let i = 0; i < daysDifference.length; i++) {
                            total += daysDifference[i];
                        }
                        var averagedays = total / daysDifference.length;
                        var longest = Math.max.apply(null, daysDifference)
                        var shortest = Math.min.apply(null, daysDifference)



                    }

                }
                res.json({
                    message: "user claims found",
                    allClaims: result,
                    Average: averagedays,
                    Longest: longest,
                    Shortest: shortest
                });
                //res.json(result)
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));

        } else {

            res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });
    router.post('/createClaim', cors(), (req, res) => {
        if (checkToken(req)) {



            const claim_no = req.body.claimno
            const totaldamagevalue = req.body.totaldamagevalue;
            const totalclaimvalue = req.body.totalclaimvalue;
            const publicadjusterid = req.body.publicadjusterid;




            if (!claim_no || !totaldamagevalue || !totalclaimvalue || !publicadjusterid || !claim_no.trim() || !totaldamagevalue.trim() || !totalclaimvalue.trim() || !publicadjusterid.trim()) {
                //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
                res.status(400).json({
                    message: 'Invalid Request !'
                });

            } else {


                createClaim.createClaim(claim_no, totaldamagevalue, totalclaimvalue, publicadjusterid)
                    .then(result => {


                        res.status(result.status).json({
                            status: result.status,
                            message: result.message
                        })
                    })

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
            }
        } else {

            res.status(401).json({
                message: 'session timeout !'
            });
        }
    });

    router.post('/rejectClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const claim_no = req.body.claimno;
        const remarks = req.body.remarks;



        if (!claim_no || !userid || !remarks || !claim_no.trim() || !userid.trim() || !remarks.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            rejectClaim.rejectClaim(claim_no, remarks)
                .then(result => {


                    res.status(result.status).json({
                        status: result.status,
                        message: result.message
                    })
                })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }

    });




    router.post('/examineClaim', cors(), (req, res) => {
        const examinerid = getUserId(req)



        const claim_no = req.body.claimno
        const assesseddamagevalue = req.body.assesseddamagevalue;
        const assessedclaimvalue = req.body.assessedclaimvalue;




        if (!claim_no || !assesseddamagevalue || !assessedclaimvalue || !examinerid || !claim_no.trim() || !assesseddamagevalue.trim() || !assessedclaimvalue.trim() || !examinerid.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            examineClaim.examineClaim(claim_no, assesseddamagevalue, assessedclaimvalue, examinerid)
                .then(result => {


                    res.status(result.status).json({
                        status: result.status,
                        message: result.message
                    })
                })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }

    });


    router.post('/negotiateClaim', cors(), (req, res) => {
        const id = getUserId(req)



        const claim_no = req.body.claimno
        const negotiationamount = req.body.negotiationamount;
        const asperterm2B = req.body.asperterm2B;




        if (!claim_no || !negotiationamount || !asperterm2B || !id || !claim_no.trim() || !negotiationamount.trim() || !asperterm2B.trim() || !id.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            negotiateClaim.negotiateClaim(claim_no, negotiationamount, asperterm2B, id)
                .then(result => {


                    res.status(result.status).json({
                        status: result.status,
                        message: result.message
                    })
                })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }

    });


    router.post('/approveClaim', cors(), (req, res) => {
        const claimadjusterid = getUserId(req)
        const claim_no = req.body.claimno;
        //   const claim_no =req.body.claimno;
        var claimnoint = parseInt(claim_no);




        if (!claim_no || !claimadjusterid || !claimadjusterid.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {
            approveClaim.approveClaim(claim_no)
                .then(result => {


                    res.status(result.status).json({
                        status: result.status,
                        message: result.message
                    })
                })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }

    });



    router.post('/approveClaimValue', cors(), (req, res) => {

        const claimadjusterid = getUserId(req)
        const claim_no = req.body.claimno;
        //   const claim_no =req.body.claimno;
        var claimnoint = parseInt(claim_no);


        if (1 == 1) {


            fetchClaimlist.fetch_Claim_list({
                "user": "risabh",
                "getclaims": "getclaims"
            })



            .then(function(result1) {



                    for (let i = 0; i < result1.claimlist.claimlist.length; i++) {



                        if (result1.claimlist.claimlist[i].claimno === claimnoint) {


                            var approveClaimvalue = result1.claimlist.claimlist[i].approvedclaim;

                            return res.status(result1.status).json({
                                message: "claimvalue found",
                                approvedclaim: approveClaimvalue
                            })
                        }
                    }



                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            return res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });



    router.post('/settleClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const claim_no = req.body.claimno;




        if (!claim_no || !userid || !claim_no.trim() || !userid.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            settleClaim.settleClaim(claim_no)
                .then(result => {


                    res.status(result.status).json({
                        status: result.status,
                        message: result.message
                    })
                })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }

    });

    router.get('/claim/UserClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {


            fetchClaimlist.fetch_Claim_list({
                "user": "risabh",
                "getclaims": "getclaims"
            })

            .then(function(result) {
                console.log("result array data" + result.claimlist.body.claimlist);

                var filteredclaims = [];
                var status = [];
                var daysDifference = [];
                console.log("length of result array" + result.claimlist.body.claimlist.length);

                for (let i = 0; i < result.claimlist.body.claimlist.length; i++) {
                    console.log("id" + id);
                    console.log("userid" + result.claimlist.body.claimlist[i].userid);
                    if (result.claimlist.body.claimlist[i].userid === id) {
                        console.log("userid" + result.claimlist.body.claimlist[i].userid);
                        filteredclaims.push(result.claimlist.body.claimlist[i]);
                        status.push(result.claimlist.body.claimlist[i].status);
                        var countstatus = count(status);
                        console.log("countstatus" + countstatus);
                        console.log("filteredclaims array " + filteredclaims);
                        if (result.claimlist.body.claimlist[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                            var date1 = new Date(result.claimlist.body.claimlist[i].claimnotifieddate);
                            console.log("date1" + date1);
                            var date2 = new Date(result.claimlist.body.claimlist[i].claimsettleddate);
                            console.log("date1" + date2);
                            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            console.log("diffDays" + diffDays);
                            daysDifference.push(diffDays)
                            console.log("daysDifference" + daysDifference);
                            var total = 0;
                            for (let i = 0; i < daysDifference.length; i++) {
                                total += daysDifference[i];
                            }
                            var averagedays = total / daysDifference.length;
                            var longest = Math.max.apply(null, daysDifference)
                            var shortest = Math.min.apply(null, daysDifference)



                        }


                    }
                }
                return res.json({
                    message: "user claims found",
                    userClaims: filteredclaims,
                    statuscount: countstatus,
                    Average: averagedays,
                    Longest: longest,
                    Shortest: shortest
                });
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));

        } else {

            return res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });



    router.get('/claim/ExaminerClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {


            fetchClaimlist.fetch_Claim_list({
                "user": "risabh",
                "getclaims": "getclaims"
            })

            .then(function(result) {
                console.log("result array data" + result.claimlist.body.claimlist);

                var filteredclaims = [];

                var status = [];
                var daysDifference = [];
                var countstatus
                console.log("length of result array" + result.claimlist.body.claimlist.length);

                for (let i = 0; i < result.claimlist.body.claimlist.length; i++) {
                    console.log("id" + id);
                    console.log("userid" + result.claimlist.body.claimlist[i].userid);
                    if (id === id) {

                        if (result.claimlist.body.claimlist[i].status == "Submitted") {
                            filteredclaims.push(result.claimlist.body.claimlist[i]);
                            status.push(result.claimlist.body.claimlist[i].status);
                            countstatus = count(status);

                            console.log("countstatus" + countstatus);
                            console.log("filteredclaims array " + filteredclaims);
                            for (let i = 0; i < filteredclaims.length; i++) {
                                if (filteredclaims[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                                    var date1 = new Date(filteredclaims[i].claimnotifieddate);
                                    console.log("date1" + date1);
                                    var date2 = new Date(filteredclaims[i].claimsettleddate);
                                    console.log("date1" + date2);
                                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                    console.log("diffDays" + diffDays);
                                    daysDifference.push(diffDays)
                                    console.log("daysDifference" + daysDifference);
                                    var total = 0;
                                    for (let i = 0; i < daysDifference.length; i++) {
                                        total += daysDifference[i];
                                    }
                                    var averagedays = total / daysDifference.length;
                                    var longest = Math.max.apply(null, daysDifference)
                                    var shortest = Math.min.apply(null, daysDifference)



                                }
                            }


                        }
                        if (result.claimlist.body.claimlist[i].status == "Notified") {
                            status.push(result.claimlist.body.claimlist[i].status);
                            countstatus = count(status);
                        }
                        if (result.claimlist.body.claimlist[i].examinerid === id) {
                            status.push(result.claimlist.body.claimlist[i].status);
                            countstatus = count(status);


                        }
                    }
                }
                return res.json({
                    message: "user claims found",
                    userClaims: filteredclaims,
                    statuscount: countstatus,
                    Average: averagedays,
                    Longest: longest,
                    Shortest: shortest

                });
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));

        } else {

            return res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });


    router.get('/claim/ClaimAdjusterClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {


            fetchClaimlist.fetch_Claim_list({
                "user": "risabh",
                "getclaims": "getclaims"
            })

            .then(function(result) {
                console.log("result array data" + result.claimlist.body.claimlist);

                var filteredclaims = [];

                var status = [];
                var daysDifference = [];
                var countstatus
                console.log("length of result array" + result.claimlist.body.claimlist.length);

                for (let i = 0; i < result.claimlist.body.claimlist.length; i++) {
                    console.log("id" + id);
                    console.log("userid" + result.claimlist.body.claimlist[i].userid);
                    if (id === id) {

                        if (result.claimlist.body.claimlist[i].status == "Examined" || result.claimlist.body.claimlist[i].status == "Validated" || result.claimlist.body.claimlist[i].status == "Approved" || result.claimlist.body.claimlist[i].status == "Settled") {
                            filteredclaims.push(result.claimlist.body.claimlist[i]);

                            if (result.claimlist.body.claimlist[i].status == "Examined") {
                                status.push(result.claimlist.body.claimlist[i].status);
                            } else if (result.claimlist.body.claimlist[i].status == "Validated") {
                                status.push(result.claimlist.body.claimlist[i].status);
                            } else if (result.claimlist.body.claimlist[i].status == "Approved") {
                                status.push(result.claimlist.body.claimlist[i].status);
                            } else if (result.claimlist.body.claimlist[i].status == "Settled") {
                                status.push(result.claimlist.body.claimlist[i].status);
                            }

                            countstatus = count(status);

                            console.log("countstatus" + countstatus);
                            console.log("filteredclaims array " + filteredclaims);
                            for (let i = 0; i < filteredclaims.length; i++) {
                                if (filteredclaims[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                                    var date1 = new Date(filteredclaims[i].claimnotifieddate);
                                    console.log("date1" + date1);
                                    var date2 = new Date(filteredclaims[i].claimsettleddate);
                                    console.log("date1" + date2);
                                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                    console.log("diffDays" + diffDays);
                                    daysDifference.push(diffDays)
                                    console.log("daysDifference" + daysDifference);
                                    var total = 0;
                                    for (let i = 0; i < daysDifference.length; i++) {
                                        total += daysDifference[i];
                                    }
                                    var averagedays = total / daysDifference.length;
                                    var longest = Math.max.apply(null, daysDifference)
                                    var shortest = Math.min.apply(null, daysDifference)



                                }
                            }


                        }

                        if (result.claimlist.body.claimlist[i].status == "Notified" || result.claimlist.body.claimlist[i].status == "Submitted") {
                            status.push(result.claimlist.body.claimlist[i].status);
                            countstatus = count(status);
                        }


                    }
                }
                return res.json({
                    message: "user claims found",
                    userClaims: filteredclaims,
                    statuscount: countstatus,
                    Average: averagedays,
                    Longest: longest,
                    Shortest: shortest

                });
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));

        } else {

            return res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });

    router.get('/claim/PublicAdjusterClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {


            fetchClaimlist.fetch_Claim_list({
                "user": "risabh",
                "getclaims": "getclaims"
            })

            .then(function(result) {
                console.log("result array data" + result.claimlist.body.claimlist);

                var filteredclaims = [];

                var status = [];
                var status1 = [];
                var daysDifference = [];
                var countstatus
                var countstatus1
                console.log("length of result array" + result.claimlist.body.claimlist.length);

                for (let i = 0; i < result.claimlist.body.claimlist.length; i++) {
                    console.log("id" + id);
                    console.log("userid" + result.claimlist.body.claimlist[i].userid);
                    if (result.claimlist.body.claimlist[i].publicadjusterid === id) {

                        if (result.claimlist.body.claimlist[i].status == "Validated" || result.claimlist.body.claimlist[i].status == "Approved" || result.claimlist.body.claimlist[i].status == "Settled") {
                            filteredclaims.push(result.claimlist.body.claimlist[i]);
                            if (result.claimlist.body.claimlist[i].status == "Validated") {
                                status1.push(result.claimlist.body.claimlist[i].status);
                                countstatus1 = count(status1);
                            } else if (result.claimlist.body.claimlist[i].status == "Approved") {
                                status.push(result.claimlist.body.claimlist[i].status);
                            } else if (result.claimlist.body.claimlist[i].status == "Settled") {
                                status.push(result.claimlist.body.claimlist[i].status);
                            }

                            countstatus = count(status);


                            console.log("filteredclaims array " + filteredclaims);
                            for (let i = 0; i < filteredclaims.length; i++) {
                                if (filteredclaims[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                                    var date1 = new Date(filteredclaims[i].claimnotifieddate);
                                    console.log("date1" + date1);
                                    var date2 = new Date(filteredclaims[i].claimsettleddate);
                                    console.log("date1" + date2);
                                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                    console.log("diffDays" + diffDays);
                                    daysDifference.push(diffDays)
                                    console.log("daysDifference" + daysDifference);
                                    var total = 0;
                                    for (let i = 0; i < daysDifference.length; i++) {
                                        total += daysDifference[i];
                                    }
                                    var averagedays = total / daysDifference.length;
                                    var longest = Math.max.apply(null, daysDifference)
                                    var shortest = Math.min.apply(null, daysDifference)



                                }
                            }


                        }

                        if (result.claimlist.body.claimlist[i].status == "Notified" || result.claimlist.body.claimlist[i].status == "Submitted" || result.claimlist.body.claimlist[i].status == "Examined") {
                            status.push(result.claimlist.body.claimlist[i].status);
                            countstatus = count(status);
                        }
                    }
                }

                return res.json({
                    message: "user claims found",
                    userClaims: filteredclaims,
                    statuscount: countstatus,
                    statuscount1: countstatus1,
                    Average: averagedays,
                    Longest: longest,
                    Shortest: shortest

                });

            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));

        } else {

            return res.status(401).json({
                message: 'cant fetch data !'
            });
        }
    });

    cloudinary.config({
        cloud_name: 'diyzkcsmp',
        api_key: '188595956976777',
        api_secret: 'F7ajPhx0uHdohqfbjq2ykBZcMiw'

    });

    router.post('/UploadDocs', multipartMiddleware, function(req, res, next) {
        const id = getUser(req)
        var photo = new Photo(req.body);
        console.log("req.files.image" + JSON.stringify(req.files));
        var imageFile = req.files.file.path;


        cloudinary.uploader.upload(imageFile, {
                tags: 'express_sample'
            })
            .then(function(image) {
                console.log('** file uploaded to Cloudinary service');
                console.dir(image);
                photo.url = image.url;
                photo.userid = id;
                // Save photo with image metadata
                return photo.save();
            })
            .then(function(photo) {

                res.send({
                    url: photo._doc.url,
                    message: "files uploaded succesfully"
                });
            })
            .finally(function() {

                res.render('photos/create_through_server', {
                    photo: photo,
                    upload: photo.image
                });
            });
    });
    
    router.get('/images/id', cors(), (req, res) => {
        const id = req.query.userid
        Photo.find({ "userid": id })
            .then((images) => {
                var image = [];
                for (let i = 0; i < images.length; i++) {
                    image.push(images[i]._doc)

                }

                res.send({

                    images: image,
                    message: "image fetched succesfully"
                });
            })


    });

    router.get('/publicadjusterlist', cors(), (req, res) => {
        const userid = getUserId(req)
        console.log(userid);



        if (!userid || !userid.trim()) {
            //the if statement checks if any of the above paramenters are null or not..if is the it sends an error report.
            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            publicAdjusterList.publicAdjusterList(userid)

            .then(function(result) {
                console.log(result)
                res.status(result.status).json({
                    status: result.status,
                    message: result.usr
                })
            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }

    });



    function getUserId(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);
                return decoded.users._id

            } catch (err) {

                return false;
            }

        } else {

            return failed;
        }
    }

    function getUser(req) {

        const token = req.query.token;

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);
                return decoded.users._id

            } catch (err) {

                return false;
            }

        } else {

            return failed;
        }
    }


    function checkToken(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);
                return true

            } catch (err) {

                return false;
            }

        } else {

            return failed;
        }
    }
}


function filterstatus(status) {

    if (1 == 1) {


        fetchClaimlist.fetch_Claim_list({
            "user": "risabh",
            "getclaims": "getclaims"
        })

        .then(function(result) {


            console.log("result" + result.claimlist.body.claimlist)
            var statusfilter = [];


            for (let i = 0; i < result.claimlist.body.claimlist.length; i++) {
                console.log("status" + status);
                console.log("statusledger" + result.claimlist.body.claimlist[i].status);
                if (result.claimlist.body.claimlist[i].status === status) {

                    statusfilter.push(result.claimlist.body.claimlist[i].status);
                    console.log("statusfilter" + statusfilter);




                }
            }
            return statusfilter;
        })

        .catch(err => res.status(err.status).json({
            message: err.message
        }));

    } else {
        return res.status(401).json({
            message: 'cant fetch data !'
        });


    }
}



function count(arr) {
    var statusname = [],
        statuscount = [],
        prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            statusname.push(arr[i]);
            statuscount.push(1);
        } else {
            statuscount[statuscount.length - 1]++;
        }
        prev = arr[i];
    }
    console.log("statusname" + statusname);
    var result = [];
    for (var status in statusname) {


        result.push({
            statusname: statusname[status],
            statuscount: statuscount[status]
        });
    }

    return result;
}

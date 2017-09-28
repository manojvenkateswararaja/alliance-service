// This is just a sample script. Paste your real code (javascript or HTML) here.
// here only routing is done and if the ro
'use strict';

var crypto = require('crypto');
const jwt = require('jsonwebtoken');
var request = require('request');
var cors = require('cors');
var dateTime = require('node-datetime');
var Promises = require('promise');

var mongoose = require('mongoose');
var Photo = require('./models/documents');

var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const register = require('./functions/register');
const savepolicy = require('./functions/savepolicy');
const deletesavepolicy = require('./functions/deletesavepolicy');
const verifyemail = require('./functions/emailverification');
const verifyphone = require('./functions/phoneverification');
// const profile = require('./functions/profile'); const password =
const nodemailer = require('nodemailer');
const config = require('./config/config.json');

const consignment = require('./functions/consignment');
const fetchConsignmentlist = require('./functions/getconsignment');
const notifyClaim = require('./functions/notifyClaim');
const createClaim = require('./functions/createClaim');
const rejectClaim = require('./functions/rejectClaim');
const examineClaim = require('./functions/examineClaim');
const negotiateClaim = require('./functions/negotiateClaim');
const approveClaim = require('./functions/approveClaim');
const settleClaim = require('./functions/settleClaim');
const login = require('./functions/login');
const registerpublicadjuster = require('./functions/registerpublicadjuster');
const publicAdjusterList = require('./functions/publicAdjusterList');
const fetchSavePolicy = require('./functions/fetchSavePolicy');
const date = require('date-and-time');

const fetchClaimlist = require('./functions/fetchClaimlist');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({apiKey: '102b95c6', apiSecret: '824bb872d74c7415'});

// connection to email API
var transporter = nodemailer.createTransport("SMTP", {
    host: 'smtp.ipage.com',
    port: 587,
    secure: true,
    auth: {
        user: "vikram.viswanathan@rapidqube.com",
        pass: "Rpqb@12345"
    }
});

module.exports = router => {

    router.get('/', (req, res) => res.send("Welcome to commercial-insurance,please hit a service !"));

    router.post('/registerUser', cors(), (req, res1) => {
        console.log("entering register function in functions ");
        const emailid = req.body.email;

        console.log(emailid);
        const passwordid = req.body.password;
        console.log(passwordid);
        const userObjects = req.body.userObject;
        console.log(userObjects);
        const usertypeid = req.body.usertype;
        console.log(usertypeid);
        var json = {
            "email": emailid,
            "password": passwordid,
            "userObject": userObjects,
            "usertype": usertypeid
        };
        var options = {
            url: 'https://apidigi.herokuapp.com/registerUser',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };
        if (!emailid || !passwordid || !usertypeid) {
            res1
                .status(400)
                .json({message: 'email or password or usertype mustbe filled !'});
        } else {
            request(options, function (err, res, body) {
                if (res && (res.statusCode === 201 || res.statusCode === 500 || res.statusCode === 409)) {
                    console.log("message" + body.message);
                    res1
                        .status(res.statusCode)
                        .json({message: body.message})
                }
            });
        }
    });
    router.post('/login', cors(), (req, res1) => {
        console.log("entering login function in functions ");
        const emailid = req.body.email;
        console.log(emailid);
        const passwordid = req.body.password;
        console.log(passwordid);
        var json = {
            "email": emailid,
            "password": passwordid
        };
        var options = {
            url: 'https://apidigi.herokuapp.com/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };
        if (!emailid || !passwordid) {
            res1
                .status(400)
                .json({message: 'Invalid Request!'});
        } else {
            request(options, function (err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 401 || res.statusCode === 402 || res.statusCode === 404)) {
                    res1
                        .status(res.statusCode)
                        .json({message: body.message, token: body.token, usertype: body.usertype, userdetails: body.userDetails})
                }
            });
        }
    });
    // router.post('/registerUser', cors(), (req, res) => {     const email =
    // req.body.email;     console.log(email);     var emailtosend = email;
    // console.log(emailtosend);     const password = req.body.password;
    // console.log(password);     const rapidID = crypto .createHash('sha256')
    // .update(email)         .digest('base64'); console.log(rapidID);     const
    // userObject = req.body.userObject; console.log(userObject);     var
    // phonetosend = userObject.phone;     const usertype = req.body.usertype;
    // console.log(usertype);     var otp = "";  var possible = "0123456789"; for
    // (var i = 0; i < 4; i++)         otp +=
    // possible.charAt(Math.floor(Math.random() * possible.length));     var
    // remoteHost = "192.168.0.20:8082";     console.log(remoteHost);     var
    // encodedMail = new Buffer(req.body.email).toString('base64');     if (!email
    // || !password || !usertype) {         res             .status(400)
    // .json({message: 'Invalid Request !'});     } else {         register
    // .registerUser(email, password, rapidID, userObject, usertype, otp,
    // encodedMail)             .then(result => {                 var link =
    // "http://" + remoteHost + "/email/verify?mail=" + encodedMail; var otptosend =
    // otp;                 var mailOptions = { transport: transporter, from:
    // '"Marin Service"<vikram.viswanathan@rapidqube.com>',         to: emailtosend,
    //                     subject: 'Please confirm your Email account', html:
    // "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
    // link + ">Click here to verify</a>"       }; transporter.sendMail(mailOptions,
    // (error, info) => { if (error) {}      });               nexmo .message
    // .sendSms('918983028076', phonetosend, otptosend, { type: 'unicode'         },
    // (err, responseData) => { if (responseData) { console.log(responseData)   }
    // });        res .status(result.status) .json({message: "Please verify your
    // emailid and phone no "})             }) .catch(err =>
    // res.status(err.status).json({message: err.message}).json({status:
    // err.status}));     } });

    router.get("/email/verify", cors(), (req, res, next) => {
        var status;
        var querymail = req.query.mail;
        console.log("URL: " + querymail);
        verifyemail
            .emailverification(querymail)
            .then(result => {
                var status = result.usr.status
                if (status.length == 2) {
                    res.send({"status": true, "message": "registration successful"});
                } else {

                    res.send({"status": false, "message": "please verify mobile no too"});
                }
            })
            .catch(err => res.status(err.status).json({message: err.message}));
    });
    router.post("/user/phoneverification", cors(), (req, res1) => {
        // const phone = parseInt(req.body.phone, 10);
        const phone = req.body.phone;
        var otp = req.body.otp;
        console.log(otp);
        console.log(phone);

        var json = {
            "phone": phone,
            "otp": otp
        };

        var options = {
            url: 'https://apidigi.herokuapp.com/user/phoneverification',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };

        if (!otp || !phone) {

            res1
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {

            request(options, function (err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 404 || res.statusCode === 409 || res.statusCode === 500)) {
                    console.log("message" + body.message);
                    res1
                        .status(res.statusCode)
                        .json({message: body.message, status: body.status})
                }

            });

        }
    });
    router.post('/testmethod', cors(), function (req, res) {
        const id = checkToken(req)
        console.log(id)
        res.send({"name": "risabh", "email": "rls@gmail.com"});
    });

    /* router.get('/users/:id', cors(), (req, res) => {

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

*/

    router.post("/fetchPolicyQuotes", (req, res) => {
        var id = getUserId(req)

        console.log("id" + id);
        var status = req.body.status;
        console.log("status" + status);
        const _id = (req.body._id);
        console.log("_id" + _id);

        var consignmentWeight = (req.body.consignmentWeight);
        console.log("consignmentWeight:" + consignmentWeight);
        var consignmentValue = (req.body.consignmentValue);
        console.log("consignmentValue:" + consignmentValue);
        var modeofTransport = req.body.modeofTransport;
        console.log("modeofTransport:" + modeofTransport);
        var packingMode = req.body.packingMode
        console.log("packingMode:" + packingMode);
        var consignmentType = req.body.consignmentType;
        console.log("consignmentType:" + consignmentType);
        var contractType = req.body.contractType;
        console.log("contractType:" + contractType);
        var policyType = req.body.policyType;
        console.log("policyType:" + policyType);
        var invoiceNo = req.body.invoiceNo;
        console.log("invoiceNo:" + invoiceNo);

        var policyIssueDate = req.body.policyissuedate
        console.log("policyIssueDate:" + policyIssueDate);
        var policyEndDate = req.body.policyenddate;
        console.log("policyEndDate:" + policyEndDate);
        var voyageStartDate = req.body.voyagestartdate;
        console.log("voyageStartDate:" + voyageStartDate);
        var voyageEndDate = req.body.voyageenddate;
        console.log("voyageEndDate:" + voyageEndDate);

        if (!status || !consignmentWeight || !consignmentValue || !modeofTransport || !packingMode || !consignmentType || !contractType || !policyType || !invoiceNo || !policyIssueDate || !policyEndDate || !voyageStartDate || !voyageEndDate || !consignmentValue.trim() || !packingMode.trim() || !consignmentType.trim() || !contractType.trim() || !policyType.trim() || !invoiceNo.trim() || !policyIssueDate.trim() || !policyEndDate.trim() || !voyageStartDate.trim() || !voyageEndDate.trim()) {

            res
                .status(400)
                .json({"status": false, "message": 'Invalid Request !'});

        } else {

            var policyList;

            if (contractType == "CIF") {

                policyList = [
                    {
                        "policyName": "21st Century Insurance",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "3500",
                        "sumInsured": "50000",
                        "premiumPayment": "12000"
                    }, {
                        "policyName": "Alfa Corporation",
                        "Roadways": "False",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "True",
                        "premiumAmount": "4000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"

                    }, {
                        "policyName": "Bajaj Allianz",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "True",
                        "premiumAmount": "3000",
                        "sumInsured": "100000",
                        "premiumPayment": "15000"
                    }, {
                        "policyName": "American International Group",
                        "Roadways": "True",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "False",
                        "premiumAmount": "3750",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"

                    }, {
                        "policyName": "Cincinnati Financial",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "5000",
                        "sumInsured": "225000",
                        "premiumPayment": "55000"
                    }, {
                        "policyName": "ICICI Lombard",
                        "Roadways": "False",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "True",
                        "premiumAmount": "1500",
                        "sumInsured": "50000",
                        "premiumPayment": "6000"
                    }
                ]

            } else if (contractType == "CIS") {

                policyList = [
                    {
                        "policyName": "Darwin Professional Underwriters, Inc.",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "3000",
                        "sumInsured": "150000",
                        "premiumPayment": "60000"
                    }, {
                        "policyName": "Eastern Insurance Holdings, Inc.",
                        "Roadways": "False",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "True",
                        "premiumAmount": "5000",
                        "sumInsured": "225000",
                        "premiumPayment": "55000"
                    }, {
                        "policyName": "EMC Insurance Group, Inc.",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "True",
                        "premiumAmount": "5000",
                        "sumInsured": "725000",
                        "premiumPayment": "15000"
                    }, {
                        "policyName": "Everest Re Group, Ltd.",
                        "Roadways": "True",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "False",
                        "premiumAmount": "5000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"
                    }, {
                        "policyName": "First Mercury Financial Corporation",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "1000",
                        "sumInsured": "50000",
                        "premiumPayment": "12000"
                    }, {
                        "policyName": "Berkshire Hathaway",
                        "Roadways": "False",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "True",
                        "premiumAmount": "3000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"
                    }
                ]

            } else if (contractType == "CIP") {
                policyList = [
                    {
                        "policyName": "All India Insurance",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "1000",
                        "sumInsured": "50000",
                        "premiumPayment": "6000"
                    }, {
                        "policyName": "Oriental",
                        "Roadways": "False",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "True",
                        "premiumAmount": "5000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"
                    }, {
                        "policyName": "Bristol West Holdings",
                        "Roadways": "False",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "True",
                        "premiumAmount": "5000",
                        "sumInsured": "725000",
                        "premiumPayment": "15000"
                    }, {
                        "policyName": "Federated National Holding Company",
                        "Roadways": "True",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "False",
                        "premiumAmount": "5000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"
                    }, {
                        "policyName": "AmCOMP Incorporated",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "1000",
                        "sumInsured": "50000",
                        "premiumPayment": "12000"
                    }, {
                        "policyName": "Carolina Group",
                        "Roadways": "False",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "True",
                        "premiumAmount": "3000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"
                    }
                ]

            } else if (contractType == "FOB") {

                policyList = [
                    {
                        "policyName": "ICICI Lombard",
                        "Roadways": "False",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "True",
                        "premiumAmount": "1000",
                        "sumInsured": "50000",
                        "premiumPayment": "60000"
                    }, {
                        "policyName": "Oriental",
                        "Roadways": "True",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "False",
                        "premiumAmount": "5000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"
                    }, {
                        "policyName": "Everest Re Group, Ltd.",
                        "Roadways": "False",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "True",
                        "premiumAmount": "5000",
                        "sumInsured": "725000",
                        "premiumPayment": "15000"
                    }, {
                        "policyName": "Eastern Insurance Holdings, Inc.",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "5000",
                        "sumInsured": "125000",
                        "premiumPayment": "20000"

                    }, {
                        "policyName": "Maersk",
                        "Roadways": "True",
                        "Shipping": "False",
                        "Railway": "True",
                        "Airways": "False",
                        "premiumAmount": "5000",
                        "sumInsured": "225000",
                        "premiumPayment": "55000"
                    }, {
                        "policyName": "21st Century Insurance",
                        "Roadways": "True",
                        "Shipping": "True",
                        "Railway": "False",
                        "Airways": "False",
                        "premiumAmount": "5000",
                        "sumInsured": "725000",
                        "premiumPayment": "15000"
                    }
                ]

            }
            savepolicy
                .savePolicy(id, _id, status, consignmentWeight, consignmentValue, modeofTransport, packingMode, consignmentType, contractType, policyType, invoiceNo, policyIssueDate, policyEndDate, voyageStartDate, voyageEndDate)
                .then((result) => {
                    console.log("_id" + result._id)
                    res
                        .status(200)
                        .json({"status": true, "message": result.message, "policyList": policyList, "_id": result._id});

                })
                .catch(err => res.status(err.status).json({message: err.message}));

        }
    });

    // fetchissuedpolicy - query fetches consignment user input given for payment of
    // consignment.
    router.get("/fetchissuedpolicy", (req, res) => {
        var issuedPolicies = [];

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {

            // do some async stuff
            fetchConsignmentlist
                .fetch_consignmentlist({"user": "dhananjay.p"})
                .then(function (result) {
                    var date = dateTime.create();
                    var formatted = date.format('Y-m-d');
                    var filteredPolicy = [];
                    var filtereddata = [];
                    var IssuedPolicy_Details;
                    var bodystr = result.consignmentlist.consignmentlist;
                    var bodyObj = bodystr
                    console.log("length" + bodyObj.length);
                    for (let i = 0; i < bodyObj.length; i++) {
                        if (bodyObj[i].id === id) {
                            filteredPolicy.push(bodyObj[i]);
                            console.log(filteredPolicy.length)
                            console.log(filteredPolicy)
                        }
                    }
                    for (let i = 0; i < filteredPolicy.length; i++) {

                        issuedPolicies.push({
                            "policyName": filteredPolicy[i].policyname,
                            "issuedDate": formatted,
                            "premiumAmount": filteredPolicy[i]
                                .premiumamount
                                .toString(),
                            "issuedAmount": filteredPolicy[i]
                                .suminsured
                                .toString(),
                            "policyHolderName": filteredPolicy[i].policyholdername,
                            "policyNumber": filteredPolicy[i]
                                .policynumber
                                .toString(),
                            "agentName": filteredPolicy[i].usertype
                        });
                    }
                    return res.json({"status": true, "issuedPolicies": issuedPolicies});

                })
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {
            res
                .status(401)
                .json({"status": false, message: 'cant fetch data !'});
        }
    });

    router.post("/consignmentDetail", cors(), (req, res) => {
        const id = getUserId(req)

        console.log("id" + id);
        const _id = (req.body._id).toString()
        console.log("_id" + _id);
        const consignmentWeight = (req.body.consignmentWeight);
        console.log("consignmentWeight:" + consignmentWeight);
        const consignmentValue = (req.body.consignmentValue);
        console.log("consignmentValue:" + consignmentValue);
        const policyName = req.body.policyName;
        console.log("policyName:" + policyName);
        const sumInsured = (req.body.sumInsured);
        console.log("sumInsured:" + sumInsured);
        const premiumAmount = (req.body.premiumAmount);
        console.log("premiumAmount:" + premiumAmount);
        const modeofTransport = req.body.modeofTransport;
        console.log("modeofTransport" + modeofTransport);
        const packingMode = req.body.packingMode
        console.log("packingMode:" + packingMode);
        const consignmentType = req.body.consignmentType;
        console.log("consignmentType:" + consignmentType);
        const contractType = req.body.contractType;
        console.log("contractType:" + contractType);
        const policyType = req.body.policyType;
        console.log("policyType:" + policyType);
        const email = req.body.email;
        console.log("email:" + email);
        const policyHolderName = req.body.policyHolderName;
        console.log("policyHolderName:" + policyHolderName);
        const userType = req.body.userType;
        console.log("userType:" + userType);
        const invoiceNo = req.body.invoiceNo;
        console.log("invoiceNo:" + invoiceNo);
        var policyNumber = "";
        var possible = "01234567891011121314151617181920213031404151523548854547585474654987878";
        for (var i = 0; i < 10; i++) 
            policyNumber += possible.charAt(Math.floor(Math.random() * possible.length));
        var policyIssueDate = req.body.policyissuedate
        console.log("policyIssueDate:" + policyIssueDate);
        var policyEndDate = req.body.policyenddate;
        console.log("policyEndDate:" + policyEndDate);
        var voyageStartDate = req.body.voyagestartdate;
        console.log("voyageStartDate:" + voyageStartDate);
        var voyageEndDate = req.body.voyageenddate;
        console.log("voyageEndDate:" + voyageEndDate);

        if (!consignmentWeight || !consignmentValue || !policyName || !sumInsured || !premiumAmount || !modeofTransport || !packingMode || !consignmentType || !contractType || !policyType || !email || !policyHolderName || !userType || !invoiceNo || !policyIssueDate || !policyEndDate || !voyageStartDate || !voyageEndDate || !consignmentWeight.trim() || !consignmentValue.trim() || !policyName.trim() || !sumInsured.trim() || !premiumAmount.trim() || !packingMode.trim() || !consignmentType.trim() || !contractType.trim() || !policyType.trim() || !email.trim() || !policyHolderName.trim() || !userType.trim() || !invoiceNo.trim() || !policyIssueDate.trim() || !policyEndDate.trim() || !voyageStartDate.trim() || !voyageEndDate.trim()) {

            res
                .status(400)
                .json({"status": false, "message": 'Invalid Request !'});

        } else {
            var message;
            var promise = new Promises(function (resolve, reject) {
                deletesavepolicy
                    .deletesavepolicy(_id)
                    .then(function (result) {
                        message = result.message
                        console.log("message" + message)
                        resolve(message);
                    })
                    .catch(err => res.status(err.status).json({message: err.message}));
            });
            promise.then(function (message) {
                consignment
                    .consignmentDetail(id, consignmentWeight, consignmentValue, policyName, sumInsured, premiumAmount, modeofTransport, packingMode, consignmentType, contractType, policyType, email, policyHolderName, userType, invoiceNo, policyNumber, policyIssueDate, policyEndDate, voyageStartDate, voyageEndDate)
                    .then((result) => {
                        res
                            .status(200)
                            .json({"message": "true", "status": "success"});
                    })
                    .catch(err => res.status(err.status).json({message: err.message}));

            });
        }
    });

    router.get('/fetchSavePolicy', cors(), (req, res) => {
        const userid = getUserId(req)
        console.log(userid);

        if (!userid || !userid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {

            fetchSavePolicy
                .fetchSavePolicy(userid)
                .then(function (result) {
                    console.log(result)
                    res
                        .status(result.status)
                        .json({status: result.status, policylist: result.policylist})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

    router.post('/notifyClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const policyno = req.body.policyno;
        const claim_no1 = Math.floor(Math.random() * (1000 - 1)) + 1;
        const claim_no = claim_no1.toString();
        const claim_title = req.body.title;
        const claim_damagedetails = req.body.damagedetails;
        if (!claim_title || !claim_damagedetails || !claim_title.trim() || !claim_damagedetails.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});
        } else {
            notifyClaim
                .notifyClaim(policyno, claim_no, claim_title, claim_damagedetails, userid)
                .then(result => {
                    res
                        .status(result.status)
                        .json({status: result.status, message: result.message})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    router.get('/claim/Claimlist', (req, res) => {

        if (checkToken(req)) {

            fetchClaimlist
                .fetch_Claim_list({"user": "risabh", "getclaims": "getclaims"})
                .then(function (result) {
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
                            var longest = Math
                                .max
                                .apply(null, daysDifference)
                            var shortest = Math
                                .min
                                .apply(null, daysDifference)

                        }

                    }
                    res.json({message: "user claims found", allClaims: result, Average: averagedays, Longest: longest, Shortest: shortest});
                    //res.json(result)
                })
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {

            res
                .status(401)
                .json({message: 'cant fetch data !'});
        }
    });
    router.post('/createClaim', cors(), (req, res) => {
        if (checkToken(req)) {

            const claim_no = req.body.claimno
            const totaldamagevalue = req.body.totaldamagevalue;
            const totalclaimvalue = req.body.totalclaimvalue;
            const publicadjusterid = req.body.publicadjusterid;

            if (!claim_no || !totaldamagevalue || !totalclaimvalue || !publicadjusterid || !claim_no.trim() || !totaldamagevalue.trim() || !totalclaimvalue.trim() || !publicadjusterid.trim()) {
                // the if statement checks if any of the above paramenters are null or not..if
                // is the it sends an error report.
                res
                    .status(400)
                    .json({message: 'Invalid Request !'});

            } else {

                createClaim
                    .createClaim(claim_no, totaldamagevalue, totalclaimvalue, publicadjusterid)
                    .then(result => {

                        res
                            .status(result.status)
                            .json({status: result.status, message: result.message})
                    })
                    .catch(err => res.status(err.status).json({message: err.message}));
            }
        } else {

            res
                .status(401)
                .json({message: 'session timeout !'});
        }
    });

    router.post('/rejectClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const claim_no = req.body.claimno;
        const remarks = req.body.remarks;

        if (!claim_no || !userid || !remarks || !claim_no.trim() || !userid.trim() || !remarks.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {

            rejectClaim
                .rejectClaim(claim_no, remarks)
                .then(result => {

                    res
                        .status(result.status)
                        .json({status: result.status, message: result.message})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

    router.post('/examineClaim', cors(), (req, res) => {
        const examinerid = getUserId(req)

        const claim_no = req.body.claimno
        const assesseddamagevalue = req.body.assesseddamagevalue;
        const assessedclaimvalue = req.body.assessedclaimvalue;

        if (!claim_no || !assesseddamagevalue || !assessedclaimvalue || !examinerid || !claim_no.trim() || !assesseddamagevalue.trim() || !assessedclaimvalue.trim() || !examinerid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {

            examineClaim
                .examineClaim(claim_no, assesseddamagevalue, assessedclaimvalue, examinerid)
                .then(result => {

                    res
                        .status(result.status)
                        .json({status: result.status, message: result.message})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

    router.post('/negotiateClaim', cors(), (req, res) => {
        const id = getUserId(req)

        const claim_no = req.body.claimno
        const negotiationamount = req.body.negotiationamount;
        const asperterm2B = req.body.asperterm2B;

        if (!claim_no || !negotiationamount || !asperterm2B || !id || !claim_no.trim() || !negotiationamount.trim() || !asperterm2B.trim() || !id.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {

            negotiateClaim
                .negotiateClaim(claim_no, negotiationamount, asperterm2B, id)
                .then(result => {

                    res
                        .status(result.status)
                        .json({status: result.status, message: result.message})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

    router.post('/approveClaim', cors(), (req, res) => {
        const claimadjusterid = getUserId(req)
        const claim_no = req.body.claimno;
        //   const claim_no =req.body.claimno;
        var claimnoint = parseInt(claim_no);

        if (!claim_no || !claimadjusterid || !claimadjusterid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {
            approveClaim
                .approveClaim(claim_no)
                .then(result => {

                    res
                        .status(result.status)
                        .json({status: result.status, message: result.message})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

    router.post('/approveClaimValue', cors(), (req, res) => {

        const claimadjusterid = getUserId(req)
        const claim_no = req.body.claimno;
        //   const claim_no =req.body.claimno;
        var claimnoint = parseInt(claim_no);

        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({"user": "risabh", "getclaims": "getclaims"})
                .then(function (result1) {

                    for (let i = 0; i < result1.claimlist.claimlist.length; i++) {

                        if (result1.claimlist.claimlist[i].claimno === claimnoint) {

                            var approveClaimvalue = result1.claimlist.claimlist[i].approvedclaim;

                            return res
                                .status(result1.status)
                                .json({message: "claimvalue found", approvedclaim: approveClaimvalue})
                        }
                    }

                })
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {

            return res
                .status(401)
                .json({message: 'cant fetch data !'});
        }
    });

    router.post('/settleClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const claim_no = req.body.claimno;

        if (!claim_no || !userid || !claim_no.trim() || !userid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {

            settleClaim
                .settleClaim(claim_no)
                .then(result => {

                    res
                        .status(result.status)
                        .json({status: result.status, message: result.message})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

     router.get('/claim/UserClaims', function (req, res) {

        var filteredclaims = [];
        var status = [];
        var daysDifference = [];
        var averagedays,
            longest,
            shortest;
        const id = getUserId(req)
        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({" user ": " risabh ", " getclaims ": " getclaims "})
                .then(function (result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];
                    var status = [];
                    var daysDifference = [];
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].insuredid);
                        if (result.claimlist.claimlist[i].insuredid === id) {
                            console.log("userid" + result.claimlist.claimlist[i].insuredid);
                            filteredclaims.push(result.claimlist.claimlist[i]);
                            status.push(result.claimlist.claimlist[i].status);
                            var countstatus = count(status);
                            console.log("countstatus" + countstatus);
                            console.log("filteredclaims array " + filteredclaims);
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
                                var longest = Math
                                    .max
                                    .apply(null, daysDifference)
                                var shortest = Math
                                    .min
                                    .apply(null, daysDifference)

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
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {

            return res
                .status(401)
                .json({message: 'cant fetch data !'});
        }
    });

    router.get('/claim/ExaminerClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({"user": "risabh", "getclaims": "getclaims"})
                .then(function (result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];

                    var status = [];
                    var daysDifference = [];
                    var countstatus
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].userid);
                        if (id === id) {

                            if (result.claimlist.claimlist[i].status == "Submitted") {
                                filteredclaims.push(result.claimlist.claimlist[i]);
                                status.push(result.claimlist.claimlist[i].status);
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
                                        var longest = Math
                                            .max
                                            .apply(null, daysDifference)
                                        var shortest = Math
                                            .min
                                            .apply(null, daysDifference)

                                    }
                                }

                            }
                            if (result.claimlist.claimlist[i].status == "Notified") {
                                status.push(result.claimlist.claimlist[i].status);
                                countstatus = count(status);
                            }
                            if (result.claimlist.claimlist[i].examinerid === id) {
                                status.push(result.claimlist.claimlist[i].status);
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
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {

            return res
                .status(401)
                .json({message: 'cant fetch data !'});
        }
    });

    router.get('/claim/ClaimAdjusterClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({"user": "risabh", "getclaims": "getclaims"})
                .then(function (result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];

                    var status = [];
                    var daysDifference = [];
                    var countstatus
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].userid);
                        if (id === id) {

                            if (result.claimlist.claimlist[i].status == "Examined" || result.claimlist.claimlist[i].status == "Validated" || result.claimlist.claimlist[i].status == "Approved" || result.claimlist.claimlist[i].status == "Settled") {
                                filteredclaims.push(result.claimlist.claimlist[i]);

                                if (result.claimlist.claimlist[i].status == "Examined") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Validated") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Approved") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Settled") {
                                    status.push(result.claimlist.claimlist[i].status);
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
                                        var longest = Math
                                            .max
                                            .apply(null, daysDifference)
                                        var shortest = Math
                                            .min
                                            .apply(null, daysDifference)

                                    }
                                }

                            }

                            if (result.claimlist.claimlist[i].status == "Notified" || result.claimlist.claimlist[i].status == "Submitted") {
                                status.push(result.claimlist.claimlist[i].status);
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
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {

            return res
                .status(401)
                .json({message: 'cant fetch data !'});
        }
    });

    router.get('/claim/PublicAdjusterClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({"user": "risabh", "getclaims": "getclaims"})
                .then(function (result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];

                    var status = [];
                    var status1 = [];
                    var daysDifference = [];
                    var countstatus
                    var countstatus1
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].userid);
                        if (result.claimlist.claimlist[i].publicadjusterid === id) {

                            if (result.claimlist.claimlist[i].status == "Validated" || result.claimlist.claimlist[i].status == "Approved" || result.claimlist.claimlist[i].status == "Settled") {
                                filteredclaims.push(result.claimlist.claimlist[i]);
                                if (result.claimlist.claimlist[i].status == "Validated") {
                                    status1.push(result.claimlist.claimlist[i].status);
                                    countstatus1 = count(status1);
                                } else if (result.claimlist.claimlist[i].status == "Approved") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Settled") {
                                    status.push(result.claimlist.claimlist[i].status);
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
                                        var longest = Math
                                            .max
                                            .apply(null, daysDifference)
                                        var shortest = Math
                                            .min
                                            .apply(null, daysDifference)

                                    }
                                }

                            }

                            if (result.claimlist.claimlist[i].status == "Notified" || result.claimlist.claimlist[i].status == "Submitted" || result.claimlist.claimlist[i].status == "Examined") {
                                status.push(result.claimlist.claimlist[i].status);
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
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {

            return res
                .status(401)
                .json({message: 'cant fetch data !'});
        }
    });

    cloudinary.config({cloud_name: 'diyzkcsmp', api_key: '188595956976777', api_secret: 'F7ajPhx0uHdohqfbjq2ykBZcMiw'});

    router.post('/UploadDocs', multipartMiddleware, function (req, res, next) {
        const id = getUser(req)
        var photo = new Photo(req.body);
        console.log("req.files.image" + JSON.stringify(req.files));
        var imageFile = req.files.file.path;

        cloudinary
            .uploader
            .upload(imageFile, {tags: 'express_sample'})
            .then(function (image) {
                console.log('** file uploaded to Cloudinary service');
                console.dir(image);
                photo.url = image.url;
                photo.userid = id;
                // Save photo with image metadata
                return photo.save();
            })
            .then(function (photo) {

                res.send({url: photo._doc.url, message: "files uploaded succesfully"});
            })
            . finally(function () {

                res.render('photos/create_through_server', {
                    photo: photo,
                    upload: photo.image
                });
            });
    });

    router.get('/images/id', cors(), (req, res) => {
        const id = req.query.userid
        Photo
            .find({"userid": id})
            .then((images) => {
                var image = [];
                for (let i = 0; i < images.length; i++) {
                    image.push(images[i]._doc)

                }

                res.send({images: image, message: "image fetched succesfully"});
            })

    });

    router.get('/publicadjusterlist', cors(), (req, res) => {
        const userid = getUserId(req)
        console.log(userid);

        if (!userid || !userid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({message: 'Invalid Request !'});

        } else {

            publicAdjusterList
                .publicAdjusterList(userid)
                .then(function (result) {
                    console.log(result)
                    res
                        .status(result.status)
                        .json({status: result.status, message: result.usr})
                })
                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

    function getUserId(req) {
        const token = req.headers['x-access-token'];
        if (token) {
            try {
                var decoded = jwt.verify(token, config.secret);
                return decoded.users[0].rapidID
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
                return decoded.users[0].rapidID
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

    function filterstatus(status) {

        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({"user": "risabh", "getclaims": "getclaims"})
                .then(function (result) {

                    console.log("result" + result.claimlist.claimlist)
                    var statusfilter = [];

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("status" + status);
                        console.log("statusledger" + result.claimlist.claimlist[i].status);
                        if (result.claimlist.claimlist[i].status === status) {

                            statusfilter.push(result.claimlist.claimlist[i].status);
                            console.log("statusfilter" + statusfilter);

                        }
                    }
                    return statusfilter;
                })
                .catch(err => res.status(err.status).json({message: err.message}));

        } else {
            return res
                .status(401)
                .json({message: 'cant fetch data !'});

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

            result.push({statusname: statusname[status], statuscount: statuscount[status]});
        }

        return result;
    }
}

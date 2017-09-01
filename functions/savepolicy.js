'use strict';

const savepolicy = require('../models/savepolicy');


exports.savePolicy = (id, consignmentWeight, consignmentValue, policyName, sumInsured, premiumAmount, modeofTransport, packingMode, consignmentType, contractType, policyType, email, policyHolderName, userType, invoiceNo, policyIssueDate, policyEndDate, voyageStartDate, voyageEndDate) =>

    new Promise((resolve, reject) => {

        const savePolicy = new savepolicy({

            id: id,
            consignmentWeight: consignmentWeight,
            consignmentValue: consignmentValue,
            policyName: policyName,
            sumInsured: sumInsured,
            premiumAmount: premiumAmount,
            modeofTransport: modeofTransport,
            packingMode: packingMode,
            consignmentType: consignmentType,
            contractType: contractType,
            policyType: policyType,
            email: email,
            policyHolderName: policyHolderName,
            userType: userType,
            invoiceNo: invoiceNo,
            policyIssueDate: policyIssueDate,
            policyEndDate: policyEndDate,
            voyageStartDate: voyageStartDate,
            voyageEndDate: voyageStartDate


        });

        savePolicy.save()

            .then(() => resolve({
                status: 201,
                message: 'policy saved Sucessfully !'
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'policy Already saved !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            });
    });
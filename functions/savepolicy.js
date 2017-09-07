'use strict';

const savepolicy = require('../models/savepolicy');


exports.savePolicy = (id, consignmentWeight, consignmentValue, modeofTransport, packingMode, consignmentType, contractType, policyType, invoiceNo) =>

    new Promise((resolve, reject) => {

        const savePolicy = new savepolicy({

            id: id,
            consignmentWeight: consignmentWeight,
            consignmentValue: consignmentValue,
           
            modeofTransport: modeofTransport,
            packingMode: packingMode,
            consignmentType: consignmentType,
            contractType: contractType,
            policyType: policyType,
           
            invoiceNo: invoiceNo,
            


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

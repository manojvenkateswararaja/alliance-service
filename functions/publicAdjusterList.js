'use strict';

const user = require('../models/user');

exports.publicAdjusterList = (userid) => {

    return new Promise((resolve, reject) => {



        user.find({
                "liscenceid": {
                    "$exists": true
                }
            }, {
                "firstname": 1,
                "lastname": 1,
                "_id": 1
            })
            .then((users) => {

                console.log(users)

                resolve({
                    status: 201,
                    usr: users
                })

            })

            .catch(err => {

                if (err.code == 11000) {

                    return reject({
                        status: 409,
                        message: 'cant fetch !'
                    });

                } else {
                    console.log("error occurred" + err);

                    return reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            })
    })
};

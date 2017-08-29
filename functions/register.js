'use strict';

const user = require('../models/user');


exports.registerUser = (firstname, lastname, email, phone, password) =>

    new Promise((resolve, reject) => {

        const newUser = new user({

            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            password: password,

        });

        newUser.save()

            .then(() => resolve({
                status: 201,
                message: 'User Registered Sucessfully !'
            }))

            .catch(err => {

                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already Registered !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            });
    });
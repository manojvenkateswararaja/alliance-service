'use strict';

const user = require('../models/user');

exports.publicadjusterList = (userid) => {

    return new Promise((resolve, reject) => {

        user
            .find({usertype:"Public Adjuster"},{
                '_id':0,
              'rapidID':1,  
             'userObject.fname':1,
             'userObject.lname':1
}
            )
            .then(users => {
                console.log("users", users)
               
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

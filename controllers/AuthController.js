var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file

const UserData   = require("../models/user");
var bcrypt       = require('bcrypt');
const saltRounds = 10;
const session    = require('express-session')
var validator    = require('validator');

/*
*  User registration
*       todo: validation
*       todo: error message
*       todo: restore signup info after an error
*/

exports.register = function(req, res){
    try {

    	// var errors = [];
    	// req.session.errors = {}
    	// req.session.errors.password = {}
    	// req.session.errors.email = {}

    	// if (!validator.isEmail(req.body.email)) {
    	// 	req.session.errors.email.error = true; 
    	// 	req.session.errors.email.message = "Not an email";
    	// }

    	// if (!validator.isLength(req.body.password, { min:8, max:undefined })) {
    	// 	req.session.errors.password.error = true; 
    	// 	req.session.errors.password.message = "Minimum 8 charecter";
    	// }

    	// if ( req.body.password != req.body.confirmPassword ) {
    	// 	req.session.errors.password.error = true; 
    	// 	req.session.errors.password.message = "Confirmed Password does not match";
    	// }

    	// if (!req.body.email) {
    	// 	req.session.errors.email.error = true; 
    	// 	req.session.errors.email.message = "Please enter an email";
    	// }

    	// if (!req.body.name) {
    	// 	req.session.errors.password.error = true; 
    	// 	req.session.errors.password.message = "Please enter a name";
    	// }

    	// if (req.session.errors.email || req.session.errors.password) {
    	// 	console.log(req.session);
    	// 	return res.redirect('/register');
    	// } else {
    	// 	console.log("ashe na");
    	// 	return res.redirect('/register');
    	// }


        /// TODO: More validation
        if ( req.body.email && req.body.name && ( req.body.password == req.body.confirmPassword ) ) {

            var userdata = {
                email: req.body.email,
                name: req.body.name
            }

            bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        userdata.password = hash;

                        UserData.create(userdata, function(err, user){
                          if (err) {
                                console.log(err);
                                return res.redirect('/');
                            } else {
                                return res.redirect('/login');
                            }
                        })

                    });
            });
        } else {
            return res.redirect('/register');
        }

    } catch(error){
        return res.redirect('/register');
    }
}


/*
*  User login
*       todo: validation
*       todo: error message
*       todo: restore login info after an error
*
*/

exports.login = function (req, res){
     try {
        if ( req.body.email && req.body.password ) {
            var user = UserData.findOne({ email: req.body.email});
            user.exec(function (err, data) {
                if (err) {
                    return res.redirect('/login');
                } else {
                    if ( data ) {
                        bcrypt.compare(req.body.password, data.password, function(err, response) {
                            if (response) {
                                req.session.userId = data._id;
                                req.session.name = data.name;
                                req.session.email = data.email;

                                req.session.cookie.id = data._id;
                                console.log(req.session)

                                return res.redirect('/gossip/chat');
                            } else {
                                return res.redirect('/login');
                            }
                        });
                    } else {
                        return res.redirect('/login')
                    }
                }
            });
        } else {
            return res.redirect('/login');
        }

    } catch(error){
      console.log(error)
        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }

}


/*
*
*   Logout users
*
*/
exports.logout = function (req, res){

    try {
        if ( req.session ) {
            req.session.destroy(function(err){
                if ( err ) {
                    console.log(err);
                    return res.redirect('/gossip/chat');
                } else {
                    return res.redirect('/');
                }
            })
        }

    } catch(e) {
        console.log(e);
    }

}

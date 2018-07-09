var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file

const UserData   = require("../models/user");
var bcrypt       = require('bcrypt');
const saltRounds = 10;
const session    = require('express-session')
var validator    = require('validator');
var validator = require("email-validator");
var passwordValidator = require('password-validator');

/*
*  User registration
*       todo: validation
*       todo: error message
*       todo: restore signup info after an error
*/


var passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces

exports.register = function(req, res, next){
  // Last Resort

  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword) {


      if (validator.validate(req.body.email) === false) {
        throw new Error("Email is not valid");
      }

      if (passwordSchema.validate(req.body.password) === false) {
        throw new Error("Password is not Strong");
      }

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }


            var userdata = {
                email: req.body.email,
                name: req.body.name
            }




            bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        userdata.password = hash;

                        UserData.create(userdata, function(err, user){
                          if (err) {
                                return next(err);
                            } else {
                                return res.redirect('/login');
                            }
                        })

                    });
            });


    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }

}


/*
*  User login
*       todo: validation
*       todo: error message
*       todo: restore login info after an error
*
*/

exports.login = function (req, res, next){
     try {
        if ( req.body.email && req.body.password ) {
            /// finds the person with email
            var user = UserData.findOne({ email: req.body.email });
            user.exec(function (err, data) {
                if (err) {
                    // return res.redirect('/login');
                    var err = new Error('Wrong email or password.');
                    err.status = 401;
                    return next(err);

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

                                var err = new Error('Wrong email or password.');
                                err.status = 401;
                                return next(err);
                                // return res.redirect('/login');
                            }
                        });
                    } else {
                        // return res.redirect('/login')
                        var err = new Error('Wrong email or password.');
                        err.status = 401;
                        return next(err);
                    }
                }
            });
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
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
                    return res.redirect('/gossip/chat');
                } else {
                    return res.redirect('/');
                }
            })
        }

    } catch(e) {
        return res.redirect('/');
    }

}

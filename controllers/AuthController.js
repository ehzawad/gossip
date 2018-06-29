var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file

const UserData   = require("../models/user");
var bcrypt       = require('bcrypt');
const saltRounds = 10;
const session    = require('express-session')

/*
*
*  User registration
*       todo: validation
*       todo: error message
*       todo: restore signup info after an error
*/

exports.register = function(req, res){
    try {

        /// TODO: More validation
      //
      //
        if ( req.body.email && req.body.name && ( req.body.password == req.body.confirmPassword ) ) {

            var userdata = {
                email: req.body.email,
                name: req.body.name
            }


          var userSchema = new Schema({
            email: {
              type: String,
              validate: {
                validator: function(v,res, cb) {
                  userdata.find({email: v}, function(err, docs) {
                    res.message = " User already exists"
                    cb(docs.length == 0)
                  })
                },
              }
            }
          })




          console.log(userSchema.message)

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
        }

    } catch(error){
        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }
}


/*
*
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

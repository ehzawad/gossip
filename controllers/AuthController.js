var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file

const UserData   = require("../models/user");
var bcrypt       = require('bcrypt');
const saltRounds = 10;

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
        if ( req.body.email && req.body.name && (req.body.password == req.body.confirmPassword) ) {
            
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
        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }

}
var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file
const session    = require('express-session')

exports.dashboard = function(req, res){
    return res.render('Gossip/index', {title: 'Chat', Name: req.session.name, Id: req.session.userId, Email: req.session.email})
}



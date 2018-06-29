var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file

exports.dashboard = function(req, res){
    return res.render('Gossip/index', {title: 'Chat'})
    //(req, res, next) => res.render('index', { title: 'Home'})
}



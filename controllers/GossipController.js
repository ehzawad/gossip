var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file

exports.dashboard = function(req, res){
    res.status(200).json({
        status: "hoise",
        chat: 'shuru'
    })
}



var log          = require('logger').createLogger();
var logger       = require('logger').createLogger('development.log'); // logs to a file
const session    = require('express-session')
const Messages   = require("../models/textmessage");
const Users   = require("../models/user");


exports.dashboard = function(req, res){
    return res.render('Gossip/index', {title: 'Chat', Name: req.session.name, Id: req.session.userId, Email: req.session.email})
}


exports.get_message = function(req, res){    
	try {
		if (req.body.from && req.body.to) {
			var query = Messages.findOne({
				$or: [
						{ 
							from: req.body.from, 
							to: req.body.to 
						}, 
						{ 
							from: req.body.to, 
							to: req.body.from 
						}
					]
			});

			query.exec(function(err, data){
				if (err) {
					res.status(500).json({
		            	success: false,
			            message: error,
			            data: []
			        }) 
				} else {
					res.status(200).json({
		            	success: true,
		          	  	message: "success",
		            	data: data
		        	})
				}
			})
		} else {
			res.status(500).json({
		        success: false,
		        message: "Required",
		        data: []
		    })
		}
		

    } catch(error){
        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }
}


exports.post_message = function(req, res){   
    // if (req.session.userId) {

    // } 
    try {
    	var message = {
    		from: req.body.from,
    		to: req.body.to,
    		message: []
    	}

		Messages.create(message, function(err, newMessage){
			if (err) {
				res.status(500).json({
					message: err
				})
			} else {
				res.status(200).json({
					data: newMessage
				})
			}
		});

    } catch(error){
        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }
}



exports.put_one_message = function(req, res){   
    // if (req.session.userId) {

    // } 
    console.log(req.body)
    try {
    	if (req.body.from && req.body.to) {
    		Messages.findOneAndUpdate(
			    {
			    	$or: [
			    		{ from: req.body.from, to: req.body.to },
			    		{ from: req.body.to, to: req.body.from }
			    	]
			    }, 
			    { $push: { 
			    	message: {
			    		message: req.body.message,
			    		sentBy: req.body.sentBy,
			    		sentById: req.body.sentById
			    	}
			    }},
			    
			    function(err, data){
				if (err) {
					res.status(500).json({
          			  	success: false,
            			message: error,
            			data: []
        			})
				} else {
					res.status(200).json({
          			  	success: true,
            			message: "success",
            			data: data
        			})
				}
			})

    	} else {
    		res.status(500).json({
          		success: false,
            	message: "error",
            	data: []
        	})
    	}
		


    } catch(error){
        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }
}

exports.get_all_users = function(req, res) {
	try {
		Users.find({}).exec(function(err,data){
			var modified = {};
			for (var key in data) {
				modified[data[key]._id] = {};
				modified[data[key]._id].userName = data[key].name;
				modified[data[key]._id].userId = data[key]._id;
				modified[data[key]._id].userEmail = data[key].email;
			}
			res.status(200).json({
				data: modified
			})
		})
	} catch(e) {
		// statements
		console.log(e);
	}
}


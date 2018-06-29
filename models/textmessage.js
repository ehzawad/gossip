const mongoose = require('mongoose')

const MessagesSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true,
  },
  status: {
  	type: String,
  	default : "No"
  },
  message: [{
    	message: {
			type: String,
			required: true
		},
    sentBy: {
      type: String,
      required: true
    },
    sentById: {
      type: String,
      required: true
    },
		time: {
			type: Date,
			required: true,
			default: Date.now
		}
    }]
  })

const Message = mongoose.model('Message', MessagesSchema)
module.exports = Message

// console.log(module.exports)

const express		 	= require('express')
const bodyParser 	 	= require('body-parser')
const app 				= express()
const mongoose 			= require('mongoose')
const cookieParser 		= require('cookie-parser');
const session           = require('express-session')
const port 				= 3000 

var connectedUser = {};
var connectedUserInfo = {};

// mongodb connection
mongoose.connect("mongodb://localhost:27017/gossip")
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

// parsing incoming requests
// create a middleware for urlencodedbody
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// seerce static filess from /public
// for examples images or css or materiallite
app.use(express.static(__dirname + '/public'))

// view engine setup
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

// include routes
// recall, you wrote those in ./routes/index.js file
// it's not necessary to give extension of js
const routes 			= require('./routes/index')
const users 			= require('./routes/users')
const authentication 	= require('./routes/Authentication')
const gossip 			= require('./routes/Gossip')

//use sessions for tracking logins
app.use(session({
  secret: 'daf44saz3dbsuvb3218318hsd',
  resave: true,
  saveUninitialized: false,
  cookie: { 
  	secure: false, 
  	maxAge:269999999999,
  	httpOnly: true
  }
}));

app.use('/', routes)
app.use('/', authentication)
app.use('/user', users)
app.use('/gossip', gossip)

// few more middleware to catch errors

// catch 404 and forward to Error Handler
app.use((req, res, next) => {
  const err = new Error('File not found !!')
  err.status = 404
  next(err)
})

// recall, middleware is a chain on function which passes responsibility through callbacks


// Error Handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', { message: err.message, error: {} })
})



/// Socket configuration
var io = require('socket.io').listen(app.listen(port));


io.sockets.on('connection', function (socket) {
	//console.log('CHater application');

   	socket.emit('previousOnline', connectedUserInfo);


	socket.on('online', function(data){

		connectedUserInfo[data.userId] = data
		connectedUser[data.userId] = socket
		var userdata = {};
		userdata[data.userId] = data;

		socket.broadcast.emit('online', userdata); 
	})

    //socket.emit('message', { message: 'welcome to the chat' });
    socket.on('chat', function (data) {
        console.log(data.to)
        if (connectedUser[data.to]) {
        	connectedUser[data.to].emit('chat', data);
        }
        connectedUser[data.from].emit('chat', data);	
    });
});

//app.listen(3000, () => console.log('express app listening on port 3000'))

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

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
const routes = require('./routes/index')
app.use('/', routes)

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
  res.renser('error', { message: err.message, error: {} })
})

app.listen(3003, () => console.log('express app listening on port 3003'))

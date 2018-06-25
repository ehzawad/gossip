const express = require('express')
const router = express.Router()

// GET root route
router.get('/', (req, res, next) => res.render('index', { title: 'Home'}))

// GET /about
router.get('/about', (req, res, next) => res.render('about', { title: 'About'}))

// GET /contact
router.get('/contact', (req, res, next) => res.render('contact', { title: 'Contact'}))

// GET /register
router.get('/register', (req, res, next) => res.render('register', { title: 'Sign Up'}))

// POST /register
router.post('/register', (req, res, next) => res.send('User Created ...not really'))

module.exports = router

// Make sure all router is exported as module otherwise you can't use it in another file
// console.log(module.exports)

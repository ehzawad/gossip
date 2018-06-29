"use strict"

const express = require('express')
const router = express.Router()

const auth = require('../controllers/AuthController')

// User authentication
router.post('/login',    auth.login);
router.get('/login',     (req, res, next) => res.render('login', { title: 'Log in'}));

router.post('/register', auth.register);

// GET /register
router.get('/register', (req, res, next) => res.render('register', { title: 'Sign Up'}))


module.exports = router;

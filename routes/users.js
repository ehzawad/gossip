"use strict"

const express = require('express')
const router = express.Router()

const user = require('../controllers/UserController')

// User authentication
router.get('/', user.get_user);
router.get('/:id', user.get_user);
router.post('/', user.post_user);
router.put('/:id', user.put_user);
router.delete('/', user.delete_user);



module.exports = router;

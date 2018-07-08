"use strict"

const express = require('express')
const router = express.Router()

const gossip = require('../controllers/GossipController')
const middle = require('../controllers/Middleware')

/// starts with /gossip then

router.get('/chat', middle.requiresLogin, gossip.dashboard);
router.post('/get_message', middle.requiresLogin, gossip.get_message);
router.post('/post_message', middle.requiresLogin, gossip.post_message);
router.post('/put_one_message', middle.requiresLogin, gossip.put_one_message);

router.get('/get_all_users', middle.requiresLogin, gossip.get_all_users);

module.exports = router

// Make sure all router is exported as module otherwise you can't use it in another file
// console.log(module.exports)

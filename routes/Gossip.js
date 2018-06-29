"use strict"

const express = require('express')
const router = express.Router()

const gossip = require('../controllers/GossipController')

/// starts with /gossip then

router.get('/chat', gossip.dashboard);
router.post('/get_message', gossip.get_message);
router.post('/post_message', gossip.post_message);
router.post('/put_one_message', gossip.put_one_message);

router.get('/get_all_users', gossip.get_all_users);

module.exports = router

// Make sure all router is exported as module otherwise you can't use it in another file
// console.log(module.exports)

"use strict"

const express = require('express')
const router = express.Router()

const gossip = require('../controllers/GossipController')

router.get('/chat', gossip.dashboard);

module.exports = router

// Make sure all router is exported as module otherwise you can't use it in another file
// console.log(module.exports)

const express = require('express');
const router = express.Router();
const { getHome, createLink, generateShortLink} = require('./controllers');

router.get('/',getHome);
router.post('/shorten',createLink)


module.exports = router;
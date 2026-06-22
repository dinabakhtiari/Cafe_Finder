const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

router.get('/login', (req, res) => {
    res.render('../views/login.ejs');
})

router.get('/', (req, res) => {
    res.send('Auth Page')
})

module.exports = router;

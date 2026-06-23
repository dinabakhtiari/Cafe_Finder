const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const connection = require('../utils/connection.js')

// Register routes
router.get('/register', (req, res) => {
    res.render('../views/register.ejs')
});

router.post('/register', async (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        return res.render('register', {
            message: "Passwords don't match"
        });
    } 
    const hashedPwd = await bcryptjs.hash(req.body.password, 10);

    connection.query(
        'INSERT INTO users SET ?',
        { name: req.body.name, email: req.body.email, password: hashedPwd },
        (err, result) => {
            if (err) {
                return res.render('register', {
                    message: 'Email already in use'
                });
            }
            req.session.userId = result.inserId;
            res.redirect('/dashboard');
        }
    );
});
// Login routes
router.get('/login', (req, res) => {
    res.render('../views/login.ejs');
})

router.post('/login', (req, res) => {

})

module.exports = router;

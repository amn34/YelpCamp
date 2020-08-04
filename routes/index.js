const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')

//home page
router.get('/', (req, res) => {
    res.render('landing');
});


//show register form
router.get('/register', (req, res) => {
    res.render('register');
});

//handle sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, createdUser) => {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to YelpCamp ${req.user.username}`);
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//handle user login
router.post('/login', passport.authenticate("local",
     {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        successFlash: 'Successfully Logged In',
        failureFlash: 'Invalid username or password'
    }), (req, res) => {
    //do nothing
});

//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
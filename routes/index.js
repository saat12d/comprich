const express = require('express');
const router = express.Router({mergeParams: true});

const middleware = require('../middleware/index');

const Message = require('../models/message.js');

let firstTime = true;

router.get('/', middleware.isNotLoggedIn, (req, res) => {
    return res.redirect('/competitions');
})

router.get('/home', middleware.isNotLoggedIn, (req, res) => {
    return res.render('index.ejs');
})

router.post('/messages', (req, res) => {
    Message.create(req.body.message, (err, msg) => {
        if(err){
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/');
        }
        req.flash('success', 'Your message has been sent.');
        return res.redirect('/');
    })
})

module.exports = router;


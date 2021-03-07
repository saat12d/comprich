const express = require('express');
const router = express.Router({mergeParams: true});

const middleware = require('../middleware/index');

const Message = require('../models/message.js');

let firstTime = true;

router.get('/', middleware.isNotLoggedIn, (req, res) => {
    if(firstTime){
        firstTime = false;
        return res.redirect('/competitions');
    }
    firstTime = true;
    return res.render('index');
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


const express = require('express');
const router = express.Router({mergeParams: true});

const middleware = require('../middleware/index');

router.get('/', middleware.isNotLoggedIn, (req, res) => {
    res.render('index');
})

module.exports = router;


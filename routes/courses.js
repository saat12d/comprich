const express = require('express')
const router = express.Router({ mergeParams: true })

const middleware = require('../middleware/index')

const Competition = require('../models/competition.js')

router.get('/courses', (req, res) => {
    res.render('updated/courses/index');
})

module.exports = router;
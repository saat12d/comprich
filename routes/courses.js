const express = require('express')
const router = express.Router({ mergeParams: true })

const middleware = require('../middleware/index')

const Competition = require('../models/competition.js')

router.get('/courses', (req, res) => {
    res.render('updated/courses/index1');
})

router.get('/courses/debate', (req, res) => {
    res.render('updated/courses/debate/index');
})

router.get('/courses/debate/1', (req, res) => {
    res.render('updated/courses/debate/1');
})

router.get('/courses/debate/2', (req, res) => {
    res.render('updated/courses/debate/2');
})

router.get('/courses/debate/3', (req, res) => {
    res.render('updated/courses/debate/3');
})

router.get('/courses/debate/4', (req, res) => {
    res.render('updated/courses/debate/4');
})

router.get('/courses/debate/5', (req, res) => {
    res.render('updated/courses/debate/5');
})

router.get('/courses/debate/6', (req, res) => {
    res.render('updated/courses/debate/6');
})

router.get('/courses/debate/7', (req, res) => {
    res.render('updated/courses/debate/7');
})

router.get('/courses/debate/8', (req, res) => {
    res.render('updated/courses/debate/8');
})

module.exports = router;
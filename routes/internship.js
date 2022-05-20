const express = require('express')
const router = express.Router({ mergeParams: true })

const middleware = require('../middleware/index')

const Competition = require('../models/competition.js')
const Message = require('../models/message.js')
const Internship = require('../models/internship.js')

const upload = require('../multer.js');
const cloudinary = require('cloudinary')


router.get('/internships', (req, res) => {
    Internship.find({}, (err, internships) => {
        if(err){
            console.log(err);
            req.flash('error', err.message);
        }
        return res.render('updated/internships', {is: internships});
    })
})
router.get('/internships/new', middleware.isInternshipManager, (req, res) => {
    return res.render('updated/new-internship.ejs')
})

router.post('/internships', middleware.isInternshipManager, upload.single('image'), async (req, res) => {
    if(req.file){
        await cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
            req.body.i.companyLogo = result.secure_url;
        })
    }
    Internship.create(req.body.i, (err, intern) => {
        if(err){
            console.log(err);
            req.flash('error', err.message);
        }
        console.log('Internship added');
        return res.redirect('/internships');
    })
})

router.get('/internships/:id', middleware.isLoggedIn, (req, res) => {
    Internship.findById(req.params.id, (err, internship) => {
        if(err){
            console.log(err);
            req.flash('error', err.message);
        }
        return res.render('updated/show-internship', {is: internship})
    })
})

module.exports = router;
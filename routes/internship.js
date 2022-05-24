const express = require('express')
const router = express.Router({ mergeParams: true })

const middleware = require('../middleware/index')

const Competition = require('../models/competition.js')
const Message = require('../models/message.js')
const Internship = require('../models/internship.js')

const upload = require('../multer.js');
const cloudinary = require('cloudinary')
const methodOverride = require('method-override')


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
            console.log('Here 4')
            req.flash('error', err.message);
            res.redirect('/');
        }
        return res.render('updated/show-internship', {is: internship})
    })
})

router.get('/internships/:id/edit', middleware.isLoggedIn, (req, res) => {
    Internship.findById(req.params.id, (err, internship) => {
        if(err){
            console.log(err);
            req.flash('error', err.message);
        }
        return res.render('updated/edit-internship', {is: internship})
    })
})

router.put('/internships/:id', middleware.isLoggedIn, (req, res) => {
    Internship.findById(req.params.id, async (err, internship) => {
        if (err) {
            console.log(err)
            alert('here 3')
            req.flash('error', err.message);
            return res.redirect('back')
        }
        if(req.file){
            await cloudinary.v2.uploader.upload((err, result) => {
                if(err){
                    console.log(err);
                    alert('here 2')
                    req.flash('error', err.message);
                    res.redirect('/internships');
                }
                req.body.i.companyLogo = result.secure_url;
            })
        }
        console.log('BEFORE')
        console.log(internship);
        Internship.findByIdAndUpdate(req.params.id, req.body.i, (err, is) => {
            if (err) {
                console.log(err)
                alert('Here 1')
                return res.redirect('back')
            }
            console.log('AFTER')
            console.log(is)
            res.redirect('/internships/' + is._id);
        })
    })
})

module.exports = router;
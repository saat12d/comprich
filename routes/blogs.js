const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const locus = require('locus');

const middleware = require('../middleware/index');

const upload = require('../multer.js');

const cloudinary = require('cloudinary');
const { render } = require('ejs');
const Blog = require('../models/blog');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET - blog home page
router.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
      if(err){
        console.log(err);
        req.flash('error', err.messsage);
        return res.redirect('back');
      }
      return res.render('blogs/index', {blogs, blogs});
    })
})

// GET - blog forms
router.get('/blogs/new', middleware.isBlogger, (req, res) => {
    return res.render('blogs/new');
})

// add middleware
// add author for blog
// add new button for blog

// // POST - creating blog
router.post('/blogs', middleware.isBlogger, upload.single('image'), async (req, res) => {
    console.log(req.file)
    req.body.image = "";
    if (req.file) {
        await cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
            req.body.image = result.secure_url;
            console.log('uploaded')
      })
    }

    let newBlog = {
      body: req.body.editor,
      title: req.body.title,
      date: Date.now(),
      image: req.body.image,
      author: req.user.firstName + " " + req.user.lastName
    }
    Blog.create(newBlog, (err, blog) => {
      if(err){
        console.log(err);
        req.flash('error', err.messsage);
        return res.redirect('back');
      }
      console.log(blog)
      console.log('successfully created blog');
      req.flash('success', 'Successfully Added Blog');
      return res.redirect('/blogs');
    })
})

router.get('/blogs/1', (req, res) => {
  res.render('blogs/temp/one');
})

router.get('/blogs/2', (req, res) => {
  res.render('blogs/temp/two');
})

// GET - blog display page
router.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
      if(err){
        console.log(err);
        req.flash('error', err.message);
        return res.redirect('/blogs');
      }
      return res.render('blogs/show', {blog: blog});
    })
})

module.exports = router;
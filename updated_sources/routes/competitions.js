const express = require('express')
const router = express.Router({ mergeParams: true })
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const locus = require('locus')
const dotenv = require('dotenv')
const async = require('async')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const open = require('open')

const middleware = require('../middleware/index')

const User = require('../models/user')
const Competition = require('../models/competition')
const Rating = require('../models/rating')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const upload = require('../multer.js')

const cloudinary = require('cloudinary')
const { render } = require('ejs')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const adminCodes = [
  { club: 'Debate', code: 'admin@debate123' },
  { club: 'DIAMUN', code: 'admin@diamun456' },
  { club: 'Owner', code: 'owner123' },
  { club: 'Test1', code: 'tester1' },
  { club: 'Test2', code: 'tester2' },
  { club: 'Test3', code: 'tester3' }
]

router.get('/', middleware.isNotLoggedIn, (req, res) => {
  res.render('index')
})

router.get('/competitions', middleware.isLoggedIn, async (req, res) => {
  let renderComps
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi')
    await Competition.find({ $or: [{ title: regex }, { desc: regex }, { location: regex }, { details: regex }] }).then(foundComps => {
      renderComps = []
      for (const comp of foundComps) {
        renderComps.push(comp)
      }
      console.log('searching...')
    }).catch((err) => {
      if (err) {
        req.flash('error', err.message)
        console.log('ERROR: ' + err.message)
        return res.redirect('back')
      }
    })
  } else {
    await Competition.find({}).then(comps => {
      renderComps = []
      for (const comp of comps) {
        renderComps.push(comp)
      }
    }).catch((err) => {
      if (err) {
        req.flash('error', err.message)
        console.log('ERROR: ' + err.message)
        return res.redirect('back')
      }
    })
    // console.log('render - ' + renderComps)
  }
  if (req.query.filter && req.query.filter !== '0') {
    console.log('in filter')
    if (req.query.filter == 'upcoming') {
      renderComps = bubbleSort(renderComps)
    }
    if (req.query.filter == 'over') {
      renderComps = isOver(renderComps)
    }
    if (req.query.filter == 'paid') {
      renderComps = arePaid(renderComps)
    }
    if (req.query.filter == 'free') {
      renderComps = areFree(renderComps)
    }
  }

  if (req.query.sort && req.query.sort !== '0') {
    console.log('in sort')
    renderComps = sortByCategory(renderComps, req.query.sort)
  }

  Rating.find({}).then((rating) => {
    res.render('competitions/competitions', { competitions: renderComps, ratings: rating })
  }).catch((err) => {
    if (err) {
      req.flash('error', err.message)
      console.log('ERROR: ' + err.message)
      return res.redirect('back')
    }
  })
})

router.get('/new', middleware.isAdmin, (req, res) => {
  res.render('competitions/new', { flag: true })
})

router.post('/competitions', middleware.isAdmin, upload.array('images', 4), async function (req, res) {
  console.log(req.files)
  console.log(req.body.competition)
  req.body.competition.images = []
  if (req.files && req.files[0]) {
    for (const file of req.files) {
      await cloudinary.v2.uploader.upload(file.path, (err, result) => {
        req.body.competition.images.push({
          url: result.secure_url,
          public_id: result.public_id
        })
        console.log('uploaded')
      })
    }
  }
  req.body.competition.fromClubName = req.user.repOf
  Competition.create(req.body.competition, (err, comp) => {
    if (err) {
      console.log(err)
      req.flash('error', err.message)
      res.redirect('back')
    } else {
      console.log(comp)
      console.log('successfully created comp')
      req.flash('success', 'Successfully added competition.')
      res.redirect('/competitions')
    }
  })
})

router.get('/competitions/:id', middleware.isLoggedIn, (req, res) => {
  Competition.findById(req.params.id).populate('ratings').exec((err, foundComp) => {
    if (err) {
      console.log(err)
      return res.redirect('back')
    }
    Rating.find({ comp_title: foundComp.title }, (err, rating) => {
      if (err) {
        req.flash('error', err.message)
        return res.redirect('back')
      }
      res.render('competitions/show', { comp: foundComp, ratings: rating })
    })
  })
})

router.get('/competitions/:id/edit', middleware.checkCompOwnership, (req, res) => {
  Competition.findById(req.params.id, (err, foundComp) => {
    if (err) {
      console.log(err)
      return res.redirect('back')
    }
    res.render('competitions/edit', { comp: foundComp })
  })
})

router.put('/competitions/:id', middleware.checkCompOwnership, upload.array('images', 4), async function (req, res) {
  Competition.findById(req.params.id, async function (err, comp) {
    if (err) {
      console.log(err)
      return res.redirect('back')
    }
    console.log(req.files)
    if (req.files[0]) {
      for (const image of comp.images) {
        await cloudinary.v2.uploader.destroy(image.public_id, (err, result) => {
          console.log('destroyed')
        })
      }
      req.body.competition.images = []
      for (const file of req.files) {
        await cloudinary.v2.uploader.upload(file.path, (err, result) => {
          req.body.competition.images.push({
            url: result.secure_url,
            public_id: result.public_id
          })
        })
      }
    }
    console.log('before update: ')
    console.log(comp)
    Competition.findByIdAndUpdate(comp._id, req.body.competition, (err, updatedComp) => {
      if (err) {
        console.log(err)
        return res.redirect('back')
      }
      console.log('after update')
      console.log(updatedComp)
      res.redirect('/competitions/' + updatedComp._id)
    })
  })
})

router.delete('/competitions/:id', middleware.checkCompOwnership, async function (req, res) {
  Competition.findByIdAndDelete(req.params.id, async function (err, comp) {
    if (err) {
      console.log(err)
      return res.redirect('back')
    }
    for (const image of comp.images) {
      await cloudinary.v2.uploader.destroy(image.public_id, (err, result) => {
        console.log('destroyed image')
      })
    }
    req.flash('success', 'Successfully deleted competition')
    console.log('Deleted competition')
    return res.redirect('/competitions')
  })
})

router.post('/competitions/:id/rating', middleware.isLoggedIn, (req, res) => {
  Competition.findById(req.params.id, (err, competition) => {
    if (err) {
      req.flash('error', err.message)
      return res.redirect('/competitions/' + comp._id)
    }
    Rating.create(req.body.rating, (err, rating) => {
      if (err) {
        console.log(err)
        req.flash('error', err.message)
        return res.redirect('back')
      }
      rating.author.id = req.user._id
      rating.author.username = req.user.username
      rating.comp.id = competition._id
      rating.comp_title = competition.title
      rating.save()
      competition.ratings.push(rating)
      competition.save()
      req.flash('success', 'Competition rated successfully.')
      return res.redirect('/competitions/' + req.params.id)
    })
  })
})

router.post('/competitions/:id/signup', middleware.hasSignedUp, (req, res) => {
  Competition.findById(req.params.id, (err, comp) => {
    if (err) {
      console.log(err)
      req.flash('error', err.message)
      return res.redirect('back')
    }
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log(err)
        req.flash('error', err.message)
        return res.redirect('/back')
      }
      const comp_details = {
        id: comp._id,
        title: comp.title
      }
      user.signedUpFor.push(comp_details)
      user.save()

      const user_details = {
        id: user._id,
        lname: user.lastName,
        fname: user.firstName,
        username: user.username
      }
      comp.signedUp.push(user_details)
      comp.save()
    })
    if (comp.signupLink.substring(0, 4) == 'https' || comp.signupLink.substring(0, 3) == 'http') {
      res.redirect(comp.signupLink)
    } else {
      res.redirect('https://' + comp.signupLink)
    }
  })
})

function escapeRegex (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function bubbleSort (inputArr) {
  const len = inputArr.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1; j++) {
      console.log(inputArr[j])
      if (inputArr[j].date > inputArr[j + 1].date) {
        const tmp = inputArr[j]
        inputArr[j] = inputArr[j + 1]
        inputArr[j + 1] = tmp
      }
    }
  }
  inputArr = inputArr.filter(i => i.date > Date.now())
  return inputArr
};

function isOver (inputArr) {
  const len = inputArr.length
  const overComps = []
  for (let i = 0; i < len; i++) {
    if (inputArr[i].date < Date.now()) {
      overComps.push(inputArr[i])
    }
  }
  return overComps
}

function arePaid (inputArr) {
  const len = inputArr.length
  const paidComps = []
  for (let i = 0; i < len; i++) {
    if (inputArr[i].price !== '' || inputArr[i].price) {
      paidComps.push(inputArr[i])
    }
  }
  return paidComps
}

function areFree (inputArr) {
  const len = inputArr.length
  const freeComps = []
  for (let i = 0; i < len; i++) {
    if (inputArr[i].price == '' || inputArr[i].price == 'None') {
      freeComps.push(inputArr[i])
    }
  }
  return freeComps
}

function sortByCategory (comps, sort) {
  console.log(comps)
  comps = comps.filter(comp => comp.category.includes(sort))
  console.log(comps)
  return comps
}

module.exports = router

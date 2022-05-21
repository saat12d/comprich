const Competition = require('../models/competition.js')
const User = require('../models/user.js')

const middleware = {}

middleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log('You need to login to do that.')
    req.flash('error', 'You need to login to do that.')
    res.redirect('/login')
}

middleware.isNotLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/competitions')
    }
    next()
}

middleware.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && (req.user.isAdmin || req.user.isOwner)) {
        return next()
    }
    console.log('You do not have permission to do that.')
    req.flash('error', 'You do not have permission to do that.')
    res.redirect('/')
}

middleware.isBlogger = function(req, res, next){
    if(req.isAuthenticated() && (req.user.isBlogger || req.user.isOwner)){
        return next();
    }
    console.log('YOU DO NOT HAVE PERMISSION TO DO THAT!!!');
    req.flash('error', "You do not have permission to do that.");
    res.redirect('/');
}

middleware.isInternshipManager = function(req, res, next){
    if(req.isAuthenticated() && (req.user.isInternship || req.user.isOwner)){
        return next();
    }
    console.log('YOU DO NOT HAVE PERMISSION TO DO THAT!!!');
    req.flash('error', "You do not have permission to do that.");
    res.redirect('/');
}

middleware.checkCompOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Competition.findById(req.params.id, (err, comp) => {
            if (err) {
                console.log(err)
                req.flash('error', 'Competition not found')
                return res.redirect('/competitions')
            }
            if (comp.fromClubName == req.user.repOf || req.user.isOwner) {
                return next()
            }
            req.flash('error', 'You do not have authorization to do that')
            console.log('You do not have authorization to do that.')
            return res.redirect('/competitions')
        })
    } else {
        req.flash('error', 'You need to login to do that.')
        console.log('You need to login to do that.')
        return res.redirect('/login')
    }
}

middleware.hasSignedUp = function (req, res, next) {
    if (req.isAuthenticated()) {
        Competition.findById(req.params.id).populate('users').exec((err, comp) => {
            if (err) {
                console.log(err)
                req.flash('error', err.message)
                return res.redirect('/competitions')
            }
            for (const item of comp.signedUp) {
                if (item.equals(req.user._id)) {
                    req.flash('error', 'You have already signed up for this competition.')
                    return res.redirect('/competitions/' + comp._id)
                }
            }
            next()
        })
    }
}

module.exports = middleware;

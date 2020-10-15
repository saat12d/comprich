const Competition = require('../models/competition.js');
const User = require('../models/user.js');

const middleware = {}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    console.log('YOU DO NOT HAVE PERMISSION TO DO THAT!!!');
    req.flash('error', "You do not have permission to do that.");
    res.redirect('/login');
}

middleware.isAdmin = function(req, res, next){
    if(req.isAuthenticated() && (req.user.isAdmin || req.user.isOwner)){
        return next();
    }
    console.log('YOU DO NOT HAVE PERMISSION TO DO THAT!!!');
    req.flash('error', "You do not have permission to do that.");
    res.redirect('/');
}

middleware.checkCompOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Competition.findById(req.params.id, (err, comp) => {
            if(err){
                console.log(err);
                req.flash('error', "Competition not found");
                return res.redirect('/competitions');
            }
            if(comp.fromClubName == req.user.repOf || req.user.isOwner){
                return next();
            }
            req.flash('error', 'You do not have authorization to do that');
            console.log('You do not have authorization to do that.')
            return res.redirect('/competitions');
        })
    } else {
        req.flash('error', 'You need to be logged in to do that.');
        console.log('You need to be logged in to do that.');
        return res.redirect('/login');
    }
}

module.exports = middleware;
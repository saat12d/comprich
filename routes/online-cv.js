const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Competition = require('../models/competition')

const middleware = require("../middleware/index");


router.get("/onlinecv", middleware.isLoggedIn,  (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        return res.render("updated/online-cv.ejs", {user: user})
    })
})

router.post('/onlinecv', (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        console.log(req.body.comp)
        console.log(req.body)
        user.cv.push({
            awards: req.body.awards,
            skills: req.body.skills,
            competition: req.body.comp_title
        })
        for(c of user.signedUpFor){
            if(c.title == req.body.comp_title){
                c.verified = true;
                break;
            }
        }
        user.save();
        console.log(user);
        res.redirect("/onlinecv");
    })
})

router.get('/add-to-cv/:title', middleware.isLoggedIn, async (req, res) => {
    await Competition.find({ title: req.params.title}, (err, foundComp) => {
        if(err){
            console.log(err)
            req.flash('error', err.message)
            return res.redirect('back')
        }
        console.log(foundComp)
        console.log(req.params.title);
        return res.render('updated/add-to-cv', {comp: foundComp})
    })
})

module.exports = router;

// FIELDS TO BE ENTERED:
// - competition name autofilled
// - awards won? text area
// - skills gained 
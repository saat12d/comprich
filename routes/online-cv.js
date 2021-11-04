const express = require("express");
const router = express.Router();

const User = require("../models/user");

const middleware = require("../middleware/index");


router.get("/onlinecv", middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        return res.render("online-cv.ejs", {user: user})
    })
})

router.post('/onlinecv', (req, res) => {
    req.user.body.cv = {
        awards: req.body.awards,
        skills: req.body.skills,
        competition: req.body.comp
    }
    User.findByIdAndUpdate(req.user._id, req.user.body, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        console.log(user);
        res.redirect("/onlinecv");
    })
})

module.exports = router;

// FIELDS TO BE ENTERED:
// - competition name autofilled
// - awards won? text area
// - skills gained 
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
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        user.cv.push({
            awards: req.body.awards,
            skills: req.body.skills,
            competition: req.body.comp
        })
        user.save();
        console.log(user);
        res.redirect("/onlinecv");
    })
})

module.exports = router;

// FIELDS TO BE ENTERED:
// - competition name autofilled
// - awards won? text area
// - skills gained 
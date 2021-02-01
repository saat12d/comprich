const express = require("express");
const router = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const locus = require("locus");
const dotenv = require("dotenv");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const upload = require("../multer.js");

const middleware = require("../middleware/index");

const User = require("../models/user");
const Competition = require("../models/competition");
const Rating = require("../models/rating");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const cloudinary = require("cloudinary");

const adminCodes = [
    {
        club: "Emirates International School Jumeirah Model United Nations",
        code: "admin@eisjmun_fe3d5",
    },
    { club: "Inspire Science", code: "admin@inspireScience_qt8b1" },
    { club: "TEDx@Dubai Inernational School", code: "admin@tedxdia_bh7v3" },
    { club: "GEMS Modern Academy Debate Society", code: "admin@gmadebate_ji4x0" },
    {
        club: "Challenge The Youth Model United Nations",
        code: "admin@cytmun_df5s5",
    },
    { club: "Capture Art", code: "admin@captureart_vn2z8" },
    {
        club: "Dubai International Academy Model United Nations",
        code: "admin@diamun_b7za9",
    },
    { club: "MARVERT", code: "admin@marvert_j4k5u" },
    {
        club: "Dubai International Academy Design Club (DIATech)",
        code: "admin@diadesign_qw4d3",
    },
    {
        club: "Dubai International Academy Tech Club (DIADesign)",
        code: "admin@diatech_mc2za9",
    },
    { club: "Business Minds", code: "admin@businessminds_yu9vb" },
    { club: "Emirates Youth Platform", code: "admin@emyouthplat_xk2qa8" },
    {club: "India's International Movement to Unite Nations", code: "admin@iimun_jb4w8"},
    {club: 'Abstract Art', code: 'admin@absart_bg7u2'},
    {club: 'Cosmos Championship', code: 'admin@cosmos_hu2w5'},
    {club: 'Decisive', code: 'admin@decisive_bv9k3'}
];

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// AUTH ROUTES

router.get("/register", middleware.isNotLoggedIn, (req, res) => {
    res.render("user/register");
});

router.post("/register", upload.single("image"), async function (req, res) {
    let newUser = new User(req.body.user);
    newUser.username = req.body.username;
    if (req.file) {
        await cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
            console.log("reached");
            newUser.pfImage = result.secure_url;
            newUser.image_id = result.public_id;
        });
    }
    for (let club of adminCodes) {
        if (club.code === req.body.adminCode) {
            newUser.isAdmin = true;
            newUser.repOf = club.club;
            break;
        }
    }
    if (req.body.adminCode == "owner123") {
        newUser.isOwner = true;
        newUser.isAdmin = true;
        newUser.repOf = "Owner";
    }
    User.register(newUser, req.body.password, async (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        console.log(user);
        console.log("reached here");
        passport.authenticate("local")(req, res, function () {
            console.log("reached2");
            req.flash("success", "Welcome to Comprich, " + user.username);
            res.redirect("/competitions");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("user/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/competitions",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to Comprich",
    }),
    (req, res) => { }
);

router.get("/logout", (req, res) => {
    req.logout();
    console.log("Logged you out!");
    req.flash("success", "Logged you out");
    res.redirect("/");
});

router.get("/forgot", middleware.isNotLoggedIn, (req, res) => {
    res.render("user/forgot");
});

router.post("/forgot", (req, res, next) => {
    async.waterfall(
        [
            function (done) {
                crypto.randomBytes(20, (err, buf) => {
                    var token = buf.toString("hex");
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({ email: req.body.email }, (err, user) => {
                    if (!user) {
                        req.flash("error", "No account with that email address exists.");
                        return res.redirect("/forgot");
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000;

                    user.save((err) => {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                let smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.GMAILACC,
                        pass: process.env.GMAILPW,
                    },
                });
                let mailOptions = {
                    to: user.email,
                    from: '"Comprich Tech Support" comprichapp@gmail.com',
                    subject: "Comprich Password Reset",
                    text:
                        "You are receiving this because you (or someone else) have requested the reset of your password. \n" +
                        "Please click on the following link, or paste this into your browser to complete the process.\n" +
                        "http://" +
                        req.headers.host +
                        "/reset/" +
                        token +
                        "\n\n" +
                        "If you did not request this, please ignore this email and our password will remain unchanged. \n\n" +
                        "Regards, \n" +
                        "Comprich Tech Support",
                };
                smtpTransport.sendMail(mailOptions, (err) => {
                    console.log("mail sent");
                    req.flash(
                        "success",
                        "An e-mail has been sent to " +
                        user.email +
                        " with further instructions."
                    );
                    done(err, "done");
                });
            },
        ],
        function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/forgot");
        }
    );
});

router.get("/reset/:token", (req, res) => {
    User.findOne(
        {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        },
        (err, user) => {
            if (!user) {
                req.flash("error", "Password reset token is invalid or has expired.");
                return res.redirect("/forgot");
            }
            res.render("user/reset", { token: req.params.token });
        }
    );
});

router.post("/reset/:token", (req, res) => {
    async.waterfall(
        [
            function (done) {
                User.findOne(
                    {
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: { $gt: Date.now() },
                    },
                    (err, user) => {
                        if (!user) {
                            req.flash("error", "Password token is invalid or has expired.");
                            return res.redirect("back");
                        }
                        if (req.body.password === req.body.confirm) {
                            user.setPassword(req.body.password, (err) => {
                                user.resetPasswordExpires = undefined;
                                user.resetPasswordToken = undefined;

                                user.save(function (err) {
                                    req.logIn(user, function (err) {
                                        done(err, user);
                                    });
                                });
                            });
                        } else {
                            req.flash("error", "Passwords do not match.");
                            return res.redirect("back");
                        }
                    }
                );
            },
            function (user, done) {
                let smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.GMAILACC,
                        pass: process.env.GMAILPW,
                    },
                });
                let mailOptions = {
                    to: user.email,
                    from: '"Comprich Tech Support" comprichapp@gmail.com',
                    subject: "Your password has been changed",
                    text:
                        "Hello, \n\n" +
                        "This is a confirmation that the password for your account " +
                        user.email +
                        " has just been changed \n\n" +
                        "If you did not authorize this password change, please get in touch with the Comprich team. \n\n" +
                        "Regards, \n" +
                        "Comprich Tech Support",
                };
                smtpTransport.sendMail(mailOptions, (err) => {
                    req.flash("success", "Your password has been changed successfully.");
                    done(err);
                });
            },
        ],
        function (err) {
            res.redirect("/competitions");
        }
    );
});

router.get("/my-profile", middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        res.render("user/profile", { user: user });
    });
});

router.get("/my-profile/edit", middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            return red.redirect("back");
        }
        res.render("user/profile-edit", { user: user });
    });
});

router.put(
    "/my-profile",
    upload.single("image"),
    middleware.isLoggedIn,
    async (req, res) => {
        if (req.file !== undefined && req.file !== undefined) {
            await cloudinary.v2.uploader
                .destroy(req.user.image_id)
                .then(() => {
                    console.log("destroyed");
                })
                .catch((err) => {
                    console.log("ERROR: " + err.message);
                });
            await cloudinary.v2.uploader
                .upload(req.file.path)
                .then((result) => {
                    req.body.user.pfImage = result.secure_url;
                    req.body.user.image_id = result.public_id;
                    console.log("uploaded");
                })
                .catch((err) => {
                    console.log("ERROR: " + err.message);
                });
        }
        User.findByIdAndUpdate(req.user._id, req.body.user, (err, user) => {
            if (err) {
                console.log(err);
                return res.redirect("back");
            }
            res.redirect("/my-profile");
        });
    }
);

router.post("/:id/remove", middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Competition.findById(req.params.id, (err, comp) => {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                return res.redirect("back");
            }
            console.log(user);
            user.signedUpFor = user.signedUpFor.filter((c) => comp.title !== c.title);
            console.log(user);
            user.save();
            comp.signedUp = remove(comp.signedUp, user);
            comp.save();
        });
        return res.redirect("/my-profile");
    });
});

function remove(arr, user) {
    outArr = [];
    for (let sign of arr) {
        if (sign.id == user._id) {
            continue;
        } else {
            outArr.push(sign);
        }
    }
    return outArr;
}

module.exports = router;

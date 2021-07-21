const express = require("express");
const router = express.Router();
const middleware = require('../middleware/index')

router.get("/notifications", (req, res) => {
    return res.render("notifications.ejs")
})

// We only want access to notifications if user is logged in but since i could not
// login on localhost i made the notifications route accessible without logging in 

router.get('/notifications', middleware.isLoggedIn, (req, res) => {
    return res.render('notifications.ejs');
})

module.exports = router;
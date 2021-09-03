const express = require("express");
const router = express.Router();

router.get("/onlinecv", (req, res) => {
    return res.render("online-cv.ejs")
})

module.exports = router;

// FIELDS TO BE ENTERED:
// - competition name autofilled
// - awards won? text area
// - skills gained 
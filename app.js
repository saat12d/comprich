const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const locus = require('locus');
const dotenv = require('dotenv');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const middleware = require('./middleware/index');

// Requiring models
const User = require('./models/user');
const Competition = require('./models/competition');
const Rating = require('./models/rating');

const passport = require('passport');
const LocalStrategy = require('passport-local');

// Requiring routes
const compRoutes = require('./routes/competitions.js');
const userRoutes = require('./routes/user.js');
const indexRoutes = require('./routes/index.js');


mongoose.connect('mongodb+srv://Saatvik:comp@richDBUser@comprich.jp7iu.mongodb.net/Comprich?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log('ERROR: ' + err.message);
})

app.use(express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(flash());
app.use(methodOverride("_method"));

dotenv.config();

const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Tata nano is a legend and the all-powerful",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.flag = false;
    next();
});

app.use('/', indexRoutes);
app.use('/', compRoutes);
app.use('/', userRoutes);


app.listen(process.env.PORT, () => {
    console.log("CompRich server has started on port " + process.env.PORT);
}) 
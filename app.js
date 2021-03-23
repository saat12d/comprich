const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const locus = require('locus')
const dotenv = require('dotenv')
const async = require('async')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const secure = require('express-force-https')

const middleware = require('./middleware/index')

// Requiring models
const User = require('./models/user')
const Competition = require('./models/competition')
const Rating = require('./models/rating')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const mongoSanitize = require('express-mongo-sanitize')

// Requiring routes
<<<<<<< HEAD
const compRoutes = require('./routes/competitions.js');
const userRoutes = require('./routes/user.js');
const indexRoutes = require('./routes/index.js');
const blogRoutes = require('./routes/blogs.js');

// mongoose.connect('mongodb://localhost:27017/comprich', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true, 
//     useFindAndModify: false, 
//     useCreateIndex: true
// }).then(() => {
//     console.log('Connected to DB');
// }).catch(err => {
//     console.log('ERROR: ' + err.message);
// })
=======
const compRoutes = require('./routes/competitions.js')
const userRoutes = require('./routes/user.js')
const indexRoutes = require('./routes/index.js')
>>>>>>> 313edb7af88a2aaec0d51337485e64d382c3986a

mongoose.connect('mongodb+srv://Saatvik:comp@richDBUser@comprich.jp7iu.mongodb.net/Comprich?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to DB')
}).catch(err => {
  console.log('ERROR: ' + err.message)
})

app.use(express.static(__dirname + '/assets'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())
app.use(methodOverride('_method'))
app.use(secure)
app.use(mongoSanitize())

dotenv.config()

<<<<<<< HEAD
const cloudinary = require('cloudinary');
const blog = require('./models/blog');
=======
const cloudinary = require('cloudinary')
>>>>>>> 313edb7af88a2aaec0d51337485e64d382c3986a

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// PASSPORT CONFIGURATION
app.set('trust proxy', 1)

app.use(session({
  secret: 'Tata nano is a legend and the all-powerful',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000, secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.flag = false;
    next();
});

// User.find({}, (err, users) => {
//     let i = 0;
//     users.forEach((user) => {
//         if(i > 144){
//             console.log(user.email + ',');
//         }
//         i++;
//     })
// })

app.use('/', indexRoutes);
app.use('/', compRoutes);
app.use('/', userRoutes);
app.use('/', blogRoutes);

app.listen(process.env.PORT, () => {
  console.log('CompRich server started on port ' + process.env.PORT)
})

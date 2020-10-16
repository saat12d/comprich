const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const locus = require('locus');
const dotenv = require('dotenv');

const middleware = require('./middleware/index');

const User = require('./models/user');
const Competition = require('./models/competition')

const passport = require('passport');
const LocalStrategy = require('passport-local');

// mongoose.connect("mongodb://localhost:27017/comprich", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true, 
//     useFindAndModify: false, 
//     useCreateIndex: true
// });

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

// MULTER AND CLOUNINARY CONFIG
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
const { checkCompOwnership } = require('./middleware/index');
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
    next();
});

const adminCodes = [
    {club: "Debate", code: 'admin@debate123'},
    {club: "DIAMUN", code: 'admin@diamun456'}
]

// ROUTES

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/competitions', (req, res) => {
    let renderComps;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Competition.find({$or: [{title: regex}, {desc: regex}, {location: regex}, {details: regex}, ]}, (err, foundComps) => {
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            return res.render('competitions', {competitions: foundComps})
        })
    } else {
        Competition.find({}, (err, comps) => {
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            if(req.query.filter == 'upcoming'){
                comps = bubbleSort(comps);
            }
            if(req.query.filter == 'over'){
                comps = isOver(comps);
            }
            if(req.query.sort){
                comps = sortByCategory(comps, req.query.sort)
            }
            res.render('competitions', {competitions: comps})
        })
    }
})

app.get('/new', middleware.isAdmin, (req, res) => {
    res.render('new');
})

app.post('/competitions', middleware.isAdmin, upload.array('images', 4), async function(req, res){
    console.log(req.files);
    console.log(req.body.competition);
    req.body.competition.images = [];
    if(req.files && req.files[0]){
        for(const file of req.files){
            await cloudinary.v2.uploader.upload(file.path, (err, result) => {
                req.body.competition.images.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
                console.log('uploaded')
            })
        }
    }
    req.body.competition.fromClubName = req.user.repOf;
    Competition.create(req.body.competition, (err, comp) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            console.log(comp);
            console.log('successfully created comp');
            res.redirect('/competitions')
        }
    })
})

app.get('/competitions/:id', (req, res) => {
    Competition.findById(req.params.id, (err, foundComp) => {
        if(err){
            console.log(err);
            return res.redirect('back');
        }
        res.render('show', {comp: foundComp})
    })
})

app.get('/competitions/:id/edit', middleware.checkCompOwnership, (req, res) => {
    Competition.findById(req.params.id, (err, foundComp) => {
        if(err){
            console.log(err);
            return res.redirect('back');
        }
        res.render('edit', {comp: foundComp});
    })
})

app.put('/competitions/:id', middleware.checkCompOwnership, upload.array('images', 4), async function(req, res){
    Competition.findById(req.params.id, async function(err, comp){
        if(err){
            console.log(err);
            return res.redirect('back');
        }
        console.log(req.files)
        if(req.files[0]){
            for(const image of comp.images){
                await cloudinary.v2.uploader.destroy(image.public_id, (err, result) => {
                    console.log('destroyed')
                })
            }
            req.body.competition.images = [];
            for(const file of req.files){
                await cloudinary.v2.uploader.upload(file.path, (err, result) => {
                    req.body.competition.images.push({
                        url: result.secure_url,
                        public_id: result.public_id
                    })
                })
            }
        }
        console.log('before update: ');
        console.log(comp);
        Competition.findByIdAndUpdate(comp._id, req.body.competition, (err, updatedComp) => {
            if(err){
                console.log(err);
                return res.redirect('back');
            }
            console.log('after update')
            console.log(updatedComp);
            res.redirect('/competitions/' + updatedComp._id)
        })
    })
})

app.delete('/competitions/:id', middleware.checkCompOwnership, async function(req, res){
    Competition.findByIdAndDelete(req.params.id, async function(err, comp){
        if(err){
            console.log(err);
            return res.redirect('back');
        }
        for(const image of comp.images){
            await cloudinary.v2.uploader.destroy(image.public_id, (err, result) =>{
                console.log('destroyed image');
            })
        }
        req.flash('success', 'Successfully deleted competition');
        console.log('Deleted competition');
        return res.redirect('/competitions');
    })
})

// AUTH ROUTES

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', upload.single('image'), async function(req, res){
    let newUser = new User(req.body.user);
    newUser.username = req.body.username;
    if(req.file){
        await cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
            console.log('reached');
            newUser.pfImage = result.secure_url;
            newUser.image_id = result.public_id;
        })
    }
    for(let club of adminCodes){
        if(club.code === req.body.adminCode){
            newUser.isAdmin = true;
            newUser.repOf = club.club;
            break;
        }
    }
    if(req.body.adminCode == 'owner123'){
        newUser.isOwner = true;
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, async(err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
       }
       console.log(user);
       console.log('reached here');
       passport.authenticate("local")(req, res, function(){
           console.log('reached2')
           res.redirect("/competitions");
       })
    })
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/competitions",
    failureRedirect: "/login"
}), (req, res) => {
});

app.get("/logout", (req, res) => {
    req.logout();
    console.log('Logged you out!');
    res.redirect("/");
})

app.get('/my-profile', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if(err){
            console.log(err);
            return res.redirect('back');
        }
        res.render('profile', {user: user});
    })
})

app.get('/my-profile/edit', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if(err){
            console.log(err);
            return red.redirect('back');
        }
        res.render('profile-edit', {user: user});
    })
})

app.put('/my-profile', upload.single('image'), middleware.isLoggedIn, async (req, res) => {
    if(req.file !== undefined && req.file !== undefined){
        await cloudinary.v2.uploader.destroy(req.user.image_id).then(() => {
            console.log('destroyed');
        }).catch(err => {
            console.log('ERROR: ' + err.message)
        })
        await cloudinary.v2.uploader.upload(req.file.path).then((result) => {
            req.body.user.pfImage = result.secure_url;
            req.body.user.image_id = result.public_id;
            console.log('uploaded');
        }).catch(err => {
            console.log('ERROR: ' + err.message);
        })
    }
    User.findByIdAndUpdate(req.user._id, req.body.user, (err, user) => {
        if(err){
            console.log(err);
            return res.redirect('back');
        }
        res.redirect('/my-profile');
    })
})

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function bubbleSort(inputArr){
    let len = inputArr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            console.log(inputArr[j]);
            if (inputArr[j].date > inputArr[j + 1].date) {
                let tmp = inputArr[j];
                inputArr[j] = inputArr[j + 1];
                inputArr[j + 1] = tmp;
            }
        }
    }
    return inputArr;
};

function isOver(inputArr){
    let len = inputArr.length;
    let overComps = [];
    for(let i = 0; i < len; i++){
        if(inputArr[i].date < Date.now()){
            overComps.push(inputArr[i]);
        }
    }
    return overComps;
}

function sortByCategory(comps, sort){
    console.log(comps);
    comps = comps.filter(comp => comp.category.includes(sort));
    console.log(comps);
    return comps;
}


app.listen(process.env.PORT, () => {
    console.log("CompRich server has started on port " + process.env.PORT);
}) 
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    yearLevel: Number,
    firstName: String,
    lastName: String,
    email: String,
    pfImage: String,
    image_id: String,
    school: String,
    isOwner: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    repOf: {type: String, default: " "},
    signedUpFor: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Competition"
        },
        title: String
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
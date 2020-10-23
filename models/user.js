const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    yearLevel: Number,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    pfImage: String,
    image_id: String,
    school: String,
    country: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isOwner: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    repOf: {type: String, default: " "},
    signedUpFor: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Competition"
            },
            title: String
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
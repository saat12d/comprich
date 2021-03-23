const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    yearLevel: Number,
    firstName: String,
    lastName: String,
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: {
            isAsync: true,
            validator: function (value, isValid) {
                const self = this
                return self.constructor.findOne({ email: value })
                    .exec(function (err, user) {
                        if (err) {
                            throw err
                        } else if (user) {
                            if (self.id === user.id) { // if finding and saving then it's valid even for existing email
                                return isValid(true)
                            }
                            return isValid(false)
                        } else {
                            return isValid(true)
                        }
                    })
            },
            message: 'User with email already exists.'
        }
    },
    pfImage: String,
    image_id: String,
    school: String,
    country: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isOwner: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    isBlogger: {type: Boolean, default: false},
    repOf: {type: String, default: " "},
    signedUpFor: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Competition'
            },
            title: String
        }
    ]
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)

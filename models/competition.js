const mongoose = require('mongoose')

const competitionSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    desc: String,
    location: String,
    category: Array,
    images: [{ url: String, public_id: String }],
    details: String,
    dateDecided: {type: Boolean, default: true},
    date: Date,
    price: { type: String, default: 'None' },
    interschool: {type: Boolean, default: true},
    signupLink: String,
    smLink: String,
    websiteLink: { type: String, default: 'none' },
    fromClubName: String,
    signUpLastDate: Date,
    ratings: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Rating'
            }
        }
    ],
    signedUp: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            fname: String,
            lname: String,
            username: String
        }
    ],
    feedback: [
        {
            text: String,
            email: String
        }
    ]
})

module.exports = mongoose.model('Competition', competitionSchema)

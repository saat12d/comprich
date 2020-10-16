const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
    title: String,
    desc: String,
    location: String,
    category: Array,
    images: [{url: String, public_id: String}],
    details: String,
    date: Date,
    signupLink: String,
    smLink: String,
    fromClubName: String,
    signUpLastDate: Date
})

module.exports = mongoose.model('Competition', competitionSchema);
const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    rating: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comp: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Competitions'
        }
    },
    comp_title: String
})

module.exports = mongoose.model('Rating', ratingSchema)

const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    latestCompsAdded: {type: Number},
    name: String
})

module.exports = mongoose.model('Stats', statsSchema);
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: String,
    date: Date,
    image: String
});

module.exports = mongoose.model('Blog', blogSchema);
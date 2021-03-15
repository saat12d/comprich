const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: String,
    date: Date
});

module.exports = mongoose.model('Blog', blogSchema);
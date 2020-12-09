const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    manga: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Manga'
    },
},{timestamps: true})

module.exports = mongoose.model('Chapter',chapterSchema)
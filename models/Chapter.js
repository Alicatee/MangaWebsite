const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    subTitle:{
        type: String
    },
    manga: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Manga'
    },
    chapNumber: {
        type: Number,
        default: 1
    }
},{timestamps: true})

module.exports = mongoose.model('Chapter',chapterSchema)
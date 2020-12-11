const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({

    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Chapter'
    },
    image: {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('MangaPage',imageSchema)
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

imageSchema.virtual('imagePath').get(function(){
    return `data:image/${this.image.contentType};base64,
    ${this.image.data.toString('base64')}`
})

module.exports = mongoose.model('MangaPage',imageSchema)
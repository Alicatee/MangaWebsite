const mongoose = require('mongoose')

const mangaSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    },
    image: {
        data: Buffer,
        contentType: String
    }
},{timestamps: true})

module.exports = mongoose.model('Manga',mangaSchema)
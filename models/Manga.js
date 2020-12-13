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

mangaSchema.virtual('mangaImagePath').get(function(){
    return `data:image/${this.image.contentType};base64,
    ${this.image.data.toString('base64')}`
})


module.exports = mongoose.model('Manga',mangaSchema)
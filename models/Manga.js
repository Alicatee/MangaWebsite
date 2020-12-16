const mongoose = require('mongoose')
const Chapter = require('./Chapter')
const Page = require('./Page')

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

mangaSchema.pre('remove',function(next){
    Chapter.find({manga: this.id}, (err,chapters) => {
        if(err){
            console.log(err)
            next(err)
        }
        chapters.forEach(chap => chap.remove())
        next()
    })
})

module.exports = mongoose.model('Manga',mangaSchema)
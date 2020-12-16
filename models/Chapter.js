const mongoose = require('mongoose')
const mangaPage = require('./Page')

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

chapterSchema.pre('remove',function(next){
    mangaPage.deleteMany({chapter: this.id},(err) => {
        if(err){
            console.log(err)
            next(err)
        }
        next()
    })
})


module.exports = mongoose.model('Chapter',chapterSchema)
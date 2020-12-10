const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const multer = require('multer')

const fs = require('fs')
const path = require('path')

const Manga = require('../models/Manga')
const MangaChapter = require('../models/Chapter')
const MangaPage = require('../models/Page')

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,path.join(__dirname,'../uploads'))
    },
    filename: (req,file,cb) => {
        cb(null,file.fieldname + '-' + Date.now())
    }
})
const upload = multer({storage: storage}).array("images")


// @desc Index Manga page
// @route GET /manga/ 
router.get('/',async(req,res) => {
    try {
        const mangas = await Manga.find().sort({createdAt: 'desc'}).limit(10).exec()
        res.render('mangas/index',{
           mangas
        })
    } catch (error) {
        console.log(error)
    }
})


// @desc Add Manga page
// @route GET /manga/add 
router.get('/add',async(req,res) => {
    try {
        const pages = await MangaPage.find({})
        res.render('mangas/addManga',{
           pages
        })
    } catch (error) {
        console.log(error)
    }
})

// @desc Single Manga page
// @route GET /manga/:id 
router.get('/:id',async(req,res) => {
    try {
        const manga = await Manga.findOne({_id: req.params.id})
        const mangaChapters = await MangaChapter.find({manga: req.params.id})
        res.render('mangas/showManga',{
           manga,
           mangaChapters
        })
    } catch (error) {
        console.log(error)
    }
})



// @desc Add Chapter page
// @route GET /manga/:id/add 
router.get('/:id/add',async(req,res) => {
   try {
       const manga = await Manga.findOne({_id: req.params.id})
       res.render('mangas/addChapter',{
           manga
       })
   } catch (error) {
       console.log(error)
   }
})

//@desc Chapter Page
// @route GET /manga/:mangaID/chapterName
router.get('/:mangaID/:chapterName',async(req,res) => {
   try {
       const chapter = await MangaChapter.findOne({manga: req.params.mangaID,title: req.params.chapterName})
       const pages = await MangaPage.find({chapter: chapter._id})
       res.render('mangas/showChapter',{
           chapter,
           pages
       })
   } catch (error) {
       
   }
})

// @desc Post Manga
// @route POST /manga
router.post('/',(req,res) => {
    upload(req,res,async function(err){
        if(err){
            return console.log(err)
        }

        const file = req.files[0]
            const obj = {
                title: req.body.title,
                desc: req.body.desc,
                cover: {
                    data: fs.readFileSync(path.join(__dirname,'../uploads/' + file.filename)),
                    contentType: 'image/png'
                }
            }
           const manga = await Manga.create(obj)
           fs.unlink(path.join(__dirname,'../uploads/' + file.filename),err => {
               console.log(err)
           })
        res.redirect(`mangas/${manga._id}`)
    })
})


// @desc Post Chapter
// @route POST /manga/:id
router.post('/:id',(req,res) => {
    upload(req,res,async function(err){
        if(err){
            return console.log(err)
        }
        const files = req.files
        try {
            const chapterTitle = getChapterName(req.body.title)
            const chapter =  await MangaChapter.create({
                title: chapterTitle,
                manga: req.params.id
            }) 
           
            for(const file of files){
                const obj = {
                    chapter: chapter._id,
                    img: {
                        data: fs.readFileSync(path.join(__dirname,'../uploads/' + file.filename)),
                        contentType: 'image/png'
                    },
                }
              await MangaPage.create(obj)
          
               fs.unlink(path.join(__dirname,'../uploads/' + file.filename),err => {
                   console.log(err)
               })
            }
            
             res.redirect(`/mangas/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    })
})


getChapterName = function(str) {
    str = str.split(' ').filter( i => i ).join(' ').replace(/ /g, '-')   
    return str
 }


module.exports = router
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

const upload = multer({
    storage: storage,
   limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
          ) {
            cb(null, true); 
        }else{
            cb('Invalid Image Type',false);
        }
      }   
}).array("images")


// @desc Index Manga page
// @route GET /manga/ 
router.get('/',async(req,res) => {
    try {
        const mangas = await Manga.find().sort({createdAt: 'desc'}).limit(10).exec()
        res.render('mangas/index',{
           mangas
        })
    } catch (error) {
        mangaError(true,res)
        console.log(error)
    }
})


// @desc Add Manga page
// @route GET /manga/add 
router.get('/add',async(req,res) => {
    try {
        res.render('mangas/addManga',{
           manga: new Manga()
        })
    } catch (error) {
        mangaError(true,res)
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
        res.redirect('/mangas')
        console.log(error)
    }
})



// @desc Add Chapter page
// @route GET /manga/:id/add 
router.get('/:id/add',async(req,res) => {
    let manga;
   try {
        manga = await Manga.findOne({_id: req.params.id})
       res.render('chapters/addChapter',{
           manga
       })
   } catch (error) {
        res.redirect('/mangas')
       console.log(error)
   }
})

//@desc Chapter Page
// @route GET /manga/:mangaID/chapterName
router.get('/:mangaID/:chapterName',async(req,res) => {
   try {
       const chapter = await MangaChapter.findOne({manga: req.params.mangaID,title: req.params.chapterName})
       const pages = await MangaPage.find({chapter: chapter._id})
       res.render('chapters/showChapter',{
           chapter,
           pages
       })
   } catch (error) {
       res.redirect(`/mangas/${req.params.mangaID}`)
   }
})

// @desc Post Manga
// @route POST /manga
router.post('/',(req,res) => {
    upload(req,res,async(err) => {
        if(err){
           return res.render('mangas/addManga',{
                errorMessage: err,
                manga: req.body
            })
        }
        try {
            const img = fs.readFileSync(req.files[0].path);
            const encode_image = img.toString('base64');
                const dataObj = {
                    title: req.body.title,
                    desc: req.body.desc,
                    image: {
                        data:  Buffer.from(encode_image, 'base64'),
                        contentType: req.files[0].mimetype,
                    }
                }
               const manga = await Manga.create(dataObj)
               console.log(req.files[0].path)
               fs.unlink((req.files[0].path),err => {
                   console.log(err)
               })
            res.redirect(`mangas/${manga._id}`)
        } catch (error) {
            mangaError(true,res)
            console.log(error)
        }
    })
})


// @desc Post Chapter
// @route POST /manga/:id
router.post('/:id',(req,res) => {
    upload(req,res,async function(err){
        try {
            const manga = await Manga.findById(req.params.id)
            if(err){
                return res.render('chapters/addChapter',{
                    manga,
                    errorMessage: err,
                })
            }
        } catch (error) {
            mangaError(true,res)
            res.redirect('/')
        }
       
        const files = req.files
        try {
            const lastChapter = await MangaChapter.findOne({manga: req.params.id}).sort({createdAt: 'desc'}).limit(1).exec()
            let chapterNumber;
            if(lastChapter){
                 chapterNumber = lastChapter.chapNumber + 1
            }else{
                chapterNumber = 1
            }
            const chapterTitle = `chapter-${chapterNumber}`
            const chapter =  await MangaChapter.create({
            //    title: `Chapter: ${chapterNumber}`,
                title: chapterTitle,
                subTitle: req.body.title,
                manga: req.params.id,
                chapNumber: chapterNumber
            }) 
            for(const file of files){
                const img = fs.readFileSync(file.path);
                const encode_image = img.toString('base64');

                const dataObj = {
                    chapter: chapter._id,
                    image: {
                        data:  Buffer.from(encode_image, 'base64'),
                        contentType: req.files[0].mimetype,
                    }
                }
              await MangaPage.create(dataObj)
               fs.unlink((file.path),err => {
                   console.log(err)
               })
            }
             res.redirect(`/mangas/${req.params.id}`)
        } catch (error) {
            mangaError(true,res)
            console.log(error)
        }
    })
})

/*
getChapterName = function(str) {
    str = str.split(' ').filter( i => i ).join(' ').replace(/ /g, '-')   
    return str
 }
*/

 function mangaError(story,res){
    if(!story){
        return res.render('error/404')
    }
    return res.render('error/500')
}


module.exports = router
const express = require('express')
const app = express()

const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv')
const mongoose = require('mongoose')


dotenv.config({path: ('./config/config.env')})

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},err => {
    console.log('connected')
})

app.use(express.static('public'))
app.set('view engine','ejs')
app.set('layout','layouts/main')
app.use(expressLayouts)



app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(methodOverride("_method"))

const indexRouter = require('./routes/index')
const mangaRouter = require('./routes/manga')


app.use('/',indexRouter)
app.use('/mangas',mangaRouter)

app.listen(process.env.PORT || 3000)
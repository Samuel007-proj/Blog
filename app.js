const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const bloglistRouter = require('./controllers/blogList')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const comment_router = require('./controllers/comment')
const statistics = require('./controllers/statistics')
const { reqLogger, tokenExtractor, userExtractor, unknownEndPoint, errorHandler} = require('./utils/midware')
const { info, error } = require('./utils/logger')
const mongoose = require('mongoose')
require('express-async-errors')
info('connecting to: ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(()=>{
        info('connected to BlogListApp')
    }).catch((err) => {
        error('error connecting to MongoDB:', err.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(reqLogger)


app.use('/', loginRouter)
app.use(tokenExtractor)
app.use('/',  usersRouter)
app.use('/', userExtractor, bloglistRouter)
app.use('/', comment_router)
app.use('/', statistics)

app.use(unknownEndPoint)
app.use(errorHandler)

module.exports = app
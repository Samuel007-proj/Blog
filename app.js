const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const bloglistRouter = require('./controllers/blogList')
const { reqLogger, unknownEndPoint, errorHandler} = require('./utils/midware')
const { info, error } = require('./utils/logger')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use('/', bloglistRouter)
app.use(reqLogger)

info('connecting to: ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(()=>{
        info('connected to BlogListApp')
    })
    .catch( err => next(err))

    
app.use(unknownEndPoint)
app.use(errorHandler)

module.exports = app
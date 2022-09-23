const mongoose = require('mongoose')
const { info } = require('../utils/logger')
const User = require('../models/user')
const Blog  = require('../models/blog')

const url = process.env.COMMENTSDB_URI

const comment_schema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    ref_blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Blog
    },
    date: {
        type: Date,
        required: true,
    }
})

comment_schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

info('connecting to ' + url)

const commentConn = mongoose.createConnection(url)
commentConn.on('connected', ()=>info('connected to commentsDB') )

module.exports = commentConn.model('Comment', comment_schema)
const mongoose = require('mongoose')
const Blog = require ('../models/blog')
const { info, error } = require('../utils/logger')

const url = process.env.BLOGUSERSDB_URI

const userSchema = new mongoose.Schema({
    name: {type: String, minlength: 3},
    username: {type: String, minlength: 6},
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            refPath: Blog
        }
    ]

})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

info('connecting to ' + url)

const cnn = mongoose.createConnection(url)
cnn.on('connected', ()=>info('connected to usersDB') )

module.exports = cnn.model('User', userSchema)
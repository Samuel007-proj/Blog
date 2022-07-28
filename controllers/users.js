const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { info, error } = require('../utils/logger')

usersRouter.get('/api/users', async (req, resp) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1 })
    resp.jsonp(users)
})

usersRouter.post('/api/users', async (req, resp) => {
    const { name, username, password } = req.body

    const existingUser = await User.findOne({ username })
    if(existingUser){
        return resp.status(400).json({
            error: 'username must be unique'
        })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
        name,
        username,
        passwordHash
    })

    const savedUser= await user.save() 
    resp.status(201).json(savedUser)
})

module.exports = usersRouter
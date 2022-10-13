const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/login', async (req, resp) => {
    const { name, username, password} = req.body

    const user = await User.findOne({ username })
    console.log(user)
    const pwdCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    
    if(!(pwdCorrect && user)){
        return resp.status(401).json({
            error: 'invalid username or password'
        })
    }
    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60
        })
    
    resp.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
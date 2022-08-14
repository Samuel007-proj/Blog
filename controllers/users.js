const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../utils/exporter.js')
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

usersRouter.get('/api/user/:username', async (req, resp) => {
    const username = req.params.username
    const user =  await User.findOne({username: username})
    
    
    if(user){
        const userId = await user._id

        const blogs = await Blog.find({user: userId})

        const blogsLength = blogs.length
        if(blogsLength){
            const getLikes = async blogs => {
                let likes = []
                await blogs.forEach( blog => {
                     likes.push(blog.likes)
                } )
                return likes
            }
        
            const likesArray = await getLikes(blogs)
            const totalLikes = likesArray.reduce((sum, prev) => {
                return sum + prev
            }, 0 )
        
            const mostBlogLikes = Math.max(...likesArray)
        
            const mostLikedBlog = await Blog.find({ likes: mostBlogLikes })
        
            const mostLikedBlogTitle = await mostLikedBlog[0].title
            resp.json({blogsLength, totalLikes, mostLikedBlogTitle})
        } else {
            
            return resp.json({nostats: 'currently, no blogs availble'})
            
        }

    }else{
        resp.status(204).json({error: "incorrect user id"})
    }

})

usersRouter.put('/api/user/:username', async (req, resp) => {
    const username = req.params.username

    const user = await User.findOne({ username: username })

    if(user){

        const name  = await user.name
        const userReq = req.body

        if(name === userReq.name){
            const password = await bcrypt.hash(userReq.password, 10)

            let newObj = {
                name,
                username,
                passwordHash: password
            }

            const newUserObj = await User.findOneAndUpdate({name, username}, newObj, { new: true, runValidators: true, context: 'query'})
            return resp.status(200).json(newUserObj)
        } else { 
            return resp.status(401).json({error: "invalid user's name"})
        }
    } else {
        return resp.status(401).json({error: "invalid username"})
    }

})
module.exports = usersRouter
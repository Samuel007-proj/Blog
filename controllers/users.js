const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../utils/exporter.js')
const Comment = require('../models/comments')
const { info, error } = require('../utils/logger')

usersRouter.get('/api/users', async (req, resp) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1 })

    const getBlogs = async(id) => {
        const items = await Blog.find({ user: id })
        return await items
    }

    const update_user = async (user_id, ids) => {
        const items = await User.findByIdAndUpdate(user_id, {blogs: ids}, {new: true})
        return await items
    }
    
    users.forEach( user => {
        info(user.username)

        const user_id = user.id

        const user_blogs =  getBlogs(user._id)
        
        user_blogs
        .then( user_blogs => { 
                const item = user_blogs.map(b => b.id); 
                console.log(item.length)
                return item
        }).then(relevant_id => {
                    update_user(user_id, relevant_id)
                        .then(item => console.log(item.blogs, 'done'))
            })
        
    } )

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

usersRouter.get('/api/user/profile', async (req, resp) => {
    const username = req.decodedToken.username
    const user =  await User.findOne({username: username})

    if(user){
        const userId = user._id
        const total_refs = await Blog.countDocuments({user: `${userId}`})
        const likes = await Blog.aggregate([
            {$group: {_id: {user: userId}, total_likes: {$sum: '$likes'}}},
            {$project: {_id: 0, total_likes:1}}
        ])
        console.log(likes, 1)

        const liked_ref = await Blog.aggregate([
            {$match: {user: userId}},
            {$sort: {likes: -1}},
            {$limit: 1},
            {$project: {title: 1, author: 1, url: 1, likes: 1, user: 1}}
        ])
        console.log(liked_ref, 3)
            /*
                total_refs
                total_likes,
                most_commented_ref,
                most_liked_ref,
            */
            resp.json({total_refs, total_likes: likes[0].total_likes, most_liked_ref: liked_ref[0]})
    }else{
        resp.status(204).json({error: "unable to find user's data"})
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
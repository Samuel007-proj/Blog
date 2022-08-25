const bloglistRouter = require('express').Router();
const Blog = require('../models/blog')
const User = require('../models/user')
const {info} = require('../utils/logger')
const midware = require('../utils/midware')

bloglistRouter.get('/api/blogs', async (req, resp) => {
    let blogs = await Blog.find({}).populate('user', {name: 1, username: 1})

    blogs.length
    ? 
        resp.json(blogs)
    :
        resp.json({noblogs: 'No blogs yet, create some blog'})
    
})

bloglistRouter.get('/api/blogs/:id', async (req,resp) => {
    let id = req.params.id
    info(id)
    let blog = await Blog.findById(id).populate('user', {name: 1, username: 1})
    resp.json(blog)
})

bloglistRouter.post('/api/blogs', async (req, resp) => {
    let body = req.body
    const decodedToken = req.decodedToken

    if(!decodedToken.id){
        return resp.status(401).json({error: 'token missing or invalid'})
    }

    let user = await User.findById(decodedToken.id)

    let blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: Number(body.likes),
        user: user._id
    })

    let savedBlog = await blog.save()
    user.blogs.push(savedBlog._id)
    await user.save()

    resp.status(201).json(savedBlog)


})

bloglistRouter.delete('/api/blogs/:id', midware.userExtractor, async (req,resp) => {
    let blogId = req.params.id
    let userId = req.decodedToken.id

    const blog = await Blog.findById(blogId)
    const isBlogAuthor = blog.user?.toString() === userId.toString()

    if(!isBlogAuthor){
        return resp.status(401).json({error: `${req.user} did not create this note`})
    }

    await Blog.findByIdAndRemove(blogId)
    resp.status(204).send(`${req.username} deleted this note ${blogId}`)
})

bloglistRouter.put('/api/blogs/:id', async (req,resp) => {
    let id = req.params.id
    let body = req.body
    
    const updateString = body.item

    const refBlog = await Blog.findById(id)
    const updateItem = refBlog[updateString]
    console.log(updateString)
    if(updateString === 'likes') {
        body = {likes: refBlog.likes+1}
    }

    try{
        let updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
        resp.json(updatedBlog)
    } catch(err){
        resp.status(400).json(err)
    }
})

module.exports = bloglistRouter
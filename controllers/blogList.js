const bloglistRouter = require('express').Router();
const Blog = require('../models/blog')
const {info} = require('../utils/logger')

bloglistRouter.get('/api/blogs', (req, resp, next) => {
    Blog.find({})
        .then((blogs) => {
            resp.json(blogs)
        })
        .catch(err => next(err))
})

bloglistRouter.get('/api/blogs/:id', (req,resp, next) => {
    let id = req.params.id
    info(id)
    Blog.findById(id)
        .then(blog =>{
            resp.json(blog)
        })
        .catch(err => next(err))
})

bloglistRouter.post('/api/blogs', (req, resp, next) => {
    let body = req.body

    let blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: Number(body.likes)
    })

    blog.save()
        .then((result) => {
            resp.json(result)
        })
        .catch(err => next(err))

})

module.exports = bloglistRouter
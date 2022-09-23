const comment_router = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const Comment = require('../models/comments')
const { info } = require('../utils/logger')

comment_router.get('/api/comments', async (req, resp) => {
    const { ref_blog_id } = req.body
    const decoded_token = req.decodedToken

    if(!decoded_token){
        resp.status(401).json({error: 'token missing or invalid'})
    }

    const comment = await Comment.find({ ref_blog_id })

    info(comment)
    resp.json(comment)

})

comment_router.post('/api/comments', async (req, resp) => {
    const {comment, ref_blog_id } = req.body
    const decoded_token = req.decodedToken

    if(!decoded_token){
        resp.status(401).json({error: 'token missing or invalid'})
    }

    const creator = await User.findById(decoded_token.id)
    console.log(ref_blog_id, 1)
    const blog = await Blog.findById(ref_blog_id)
    const ref_blog = blog._id
    console.log(ref_blog, 2)

    const comment_obj = new Comment({
        comment,
        creator,
        ref_blog,
        date: new Date()
    })

    const saved_comment = await comment_obj.save()
    info(saved_comment)
    resp.status(201).json(saved_comment)
})

module.exports = comment_router
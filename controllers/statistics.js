const statistics = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comments')
const {info} = require('../utils/logger')
const midware = require('../utils/midware')

statistics.get('/api/stats',  async (req, resp) => {
    //blogs
    const blogs = await Blog.countDocuments({})

    const ref_with_most_comment = await Comment.aggregate([
        {$group: {_id: '$ref_blog', number: {$sum: 1} } },
        {$sort: {number: -1}},
        {$limit: 1},
        {$project: {_id: 1, number:0}}
    ])

    const most_commented_ref = await Blog.findById(ref_with_most_comment[0]._id)


    const liked_ref = await Blog.aggregate([
        {$project: {title: 1, author: 1, url: 1, likes: 1, user: 1}},
        {$sort: {likes: -1}},
        {$limit: 1}
    ])

//user
    const users = await User.countDocuments({})
    const most_refs = await User.aggregate([
        {$project: {name: 1, username: 1, blogs: 1}},
        {$sort: {blogs: -1}},
        {$limit: 1}
    ])
    const user_id = await liked_ref[0].user
    const most_likes = await User.findById(user_id)

    resp.json({blogs, most_commented_ref, most_liked_ref: liked_ref[0], users, most_refs: most_refs[0], most_likes})
})

module.exports = statistics
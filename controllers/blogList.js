const bloglistRouter = require('express').Router();
const Blog = require('../models/blog')
const {info} = require('../utils/logger')

bloglistRouter.get('/api/blogs', async (req, resp) => {
    let blogs = await Blog.find({})
    resp.json(blogs)
})

bloglistRouter.get('/api/blogs/:id', async (req,resp) => {
    let id = req.params.id
    info(id)
    let blog = await Blog.findById(id)
    resp.json(blog)
})

bloglistRouter.post('/api/blogs', async (req, resp) => {
    let body = req.body

    let blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: Number(body.likes)
    })

    let result = await blog.save()
    resp.json(result)

    const blogs = [
        {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7
        },
        {
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5
        },
        {
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12
        },
        {
          title: "First class tests",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
          likes: 10
        },
        {
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0
        },
        {
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 2
        }  
      ]
    await Blog.insertMany(blogs)

})

bloglistRouter.delete('/api/blogs/:id', async (req,resp) => {
    let id = req.params.id
    await Blog.findByIdAndRemove(id)
    info('done')
    resp.status(204).json('done')
})

bloglistRouter.put('/api/blogs/:id', async (req,resp) => {
    let id = req.params.id
    let body = req.body
    let blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: Number(body.likes)
    }
    let updatedBlog = await Blog.findByIdAndUpdate(id, blog)
    resp.json(updatedBlog)
})

module.exports = bloglistRouter
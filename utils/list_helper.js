const totalLikes = blogs => {
        return blogs.length ===1 
        ? blogs[0].likes 
        : blogs.map(list => {
           return list.likes
        }).reduce((sum, likes) => {
            return sum + likes
        }, 0); 
}

const favouriteBlog = blogs => {
    if(blogs.length === 1){
        return blogs[0]
    } else {
        let likes = blogs.map(list => {return list.likes })
        let maxIndex = likes.indexOf(Math.max(...likes))
        return blogs[maxIndex]
    } 
}

const mostBlogs = blogs => {
    let authors = blogs.map(blog => { return blog.author} )
    let authorsBlogCount = [];

    authors.forEach(author => {
        let blogCount =  {"author": author, blogs: 0}

        blogs.forEach( blog => {
            if(blog.author === author) {blogCount.blogs++}
        })

        authorsBlogCount.push(blogCount)
    })
        let maxBlog = Math.max(...(authorsBlogCount.map(author => { return author.blogs})))
        return authorsBlogCount.find(author => author.blogs === maxBlog)
}

const mostLikes = blogs => {
    let authors = blogs.map(blog => { return blog.author} )
    let authorsLikesCount = [];

    authors.forEach(author => {
        let blogCount =  {"author": author, likes: 0}

        blogs.forEach( blog => {
            if(blog.author === author) {blogCount.likes += blog.likes}
        })
        authorsLikesCount.push(blogCount)
    })
        let maxLikes = Math.max(...(authorsLikesCount.map(author => { return author.likes})))

        return authorsLikesCount.find(author => author.likes === maxLikes)
}

module.exports = {
    totalLikes, favouriteBlog, mostBlogs, mostLikes
}
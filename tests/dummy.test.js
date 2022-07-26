const { totalLikes, favouriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')


test('sum of all likes', () => {
    const result = totalLikes(blogs)
    expect(result).toBeGreaterThan(10)
})

test('when list has only one blog, equals the likes of that',  () => {
    
    const result = totalLikes(blogs)
    expect(result).toBeGreaterThan(10)
} )

test('finds the favourite blog', () => {
    const result = favouriteBlog(blogs)
    expect(result).not.toEqual({likes: 1})
})

test('author who has the highest number of blogs', () => {
    const result = mostBlogs(blogs)
    expect(result).toEqual({author: "Robert C. Martin", blogs: 3})
})

test('author who has the highest number of Likes', () => {
    const result = mostLikes(blogs)
    expect(result).toEqual({
        author: "Edsger W. Dijkstra",
        likes: 17
      })
})
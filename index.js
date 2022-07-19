const http = require('http')
const app = require('./app')
const config = require('./utils/config')
const { info } = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
    info(`server running on port ${config.PORT}`)
})
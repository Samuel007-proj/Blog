const { info, error } = require('./logger')
const jwt = require('jsonwebtoken')

const reqLogger = (req, resp, next) => {
    info('METHOD:', req.method )
    info('PATH:', req.path )
    info('BODY:', req.body )
    info('_____________________________' )
    next()
}

const unknownEndPoint = (req, resp, next) => {
    resp.status(404).json({error: 'unknown end point'})
}

const errorHandler =(err, req, resp, next) => {
    error(err);
    if (err.name === 'CastError'){
        return resp.status(400).send({error: 'malformatted id'})
    } else if (err.name === 'ValidationError') {
        return resp.status(400).json({error: err.message})
    } else if (err.name === 'JsonWebTokenError') {
        return resp.status(400).json({error: 'invalid token'})
    }else if (err.name === 'TokenExpiredError') {
        return resp.status(400).json({error: 'token expired'})
    }
    next(err)
}

const getTokenFrom = req => {
    const auth = req.get('authorization')
    if(auth && auth.toLowerCase().startsWith('bearer ')){
        return auth.substring(7)
    }
    return null
}

const tokenExtractor = (req, resp, next) => {
    const token = getTokenFrom(req)
    req.decodedToken = jwt.verify(token, process.env.SECRET)
    next()
}

const userExtractor = (req, resp, next) => {
    const token = getTokenFrom(req)
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded.username
    next()
}

module.exports = {
    reqLogger, tokenExtractor, userExtractor , unknownEndPoint, errorHandler
}
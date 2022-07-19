const { info, error } = require('./logger')

const reqLogger = (req, resp, next) => {
    info('METHOD: ', req.method )
    info('PATH: ', req.path )
    info('BODY: ', req.body )
    info('_________________' )
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
    }
    next(err)
}

module.exports = {
    reqLogger, unknownEndPoint, errorHandler
}
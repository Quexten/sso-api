import express from 'express'
let router = express.Router()

module.exports = (authenticationMiddleware) => {
    router.use('/', authenticationMiddleware)
    return router
}

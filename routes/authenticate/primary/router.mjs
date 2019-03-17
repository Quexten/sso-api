import express from 'express'
let router = express.Router()

export default (authenticationMiddleware) => {
    router.use('/', authenticationMiddleware)
    return router
}

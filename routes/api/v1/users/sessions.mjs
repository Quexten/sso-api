import express from 'express'

module.exports = function () {
    const router = express.Router()

    router.get('/', function (req, res) {
        res.send(req.user.auth.sessions)
    })

    return router
}
module.exports = function () {
    const express = require('express')
    const router = express.Router()

    router.get('/', function (req, res) {
        res.send(req.user.auth.sessions)
    })

    return router
}
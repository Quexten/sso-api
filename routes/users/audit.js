module.exports = function () {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.get('/', function (req, res) {
        res.send(req.user.audit)
    })

    return router
}
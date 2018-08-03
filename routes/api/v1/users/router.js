module.exports = function (profileApi) {
    const express = require('express')
    const router = express.Router()

    router.use('/:id/audit', require('./audit'))
    router.use("/:id/profile", require("./profile")(profileApi))
    router.use('/:id/sessions', require('./sessions'))

    return router
}


module.exports = function (database) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    //Inject user object from database
    router.use('/:id', function (req, res, next) {
        database.findUserById(req.params.id, (err, user) => {
            if (err == null)
                req.user = user
            next()
        })
    })

    router.use("/:id/profile", require("./profile")())
    router.use("/:id/audit", require("./audit")())
    router.use("/:id/sessions", require("./sessions")())
    return router
}
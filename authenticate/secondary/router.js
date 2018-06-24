let jwt = require('jsonwebtoken')
let express = require('express')
let router = express.Router()

let secondaryAuthenticators = []
secondaryAuthenticators["backup-codes"] = require("./codes")
secondaryAuthenticators["totp"] = require("./totp")
secondaryAuthenticators["u2f"] = require("./u2f")

module.exports = function (database) {
    router.get("/:authenticator/:method", (req, res, next) => {
        //Data contains jwt of user
        let id = req.query.user
        database.findUserById(id, (err, user) => {
            if (user) {
                req.user = user
                next()
            }
        })
    })
    router.get("/:authenticator/create", (req, res) => {
        let authenticatorType = req.params.authenticator
        secondaryAuthenticators[authenticatorType].create(req, res, (user) => {
            database.updateUser(user._id, user)
        })
    })

    router.get("/:authenticator/verify", (req, res) => {
        let authenticatorType = req.params.authenticator
        secondaryAuthenticators[authenticatorType].verify(req, res, (user) => {
            database.updateUser(user._id, user)
        })
    })

    router.get("/:authenticator/authenticate", (req, res) => {
        let authenticatorType = req.params.authenticator
        req.user.auth.secondary.forEach((authenticator) => {
            if (authenticator.id === authenticatorType) {
                let authAttempt = secondaryAuthenticators[authenticatorType].authenticate(req, authenticator)
                if (authAttempt) {
                    res.send(true)
                }
            }
        })

        res.send(false)
    })

    return router
}


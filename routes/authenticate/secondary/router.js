let jwt = require('jsonwebtoken')
let express = require('express')
let router = express.Router()

let secondaryAuthenticators = []
secondaryAuthenticators["backup-codes"] = require("../../../authenticate/secondary/codes")
secondaryAuthenticators["totp"] = require("../../../authenticate/secondary/totp")
secondaryAuthenticators["u2f"] = require("../../../authenticate/secondary/u2f")

module.exports = (jwtHandler, database) => {
    router.get("/:authenticator/:method", (req, res, next) => {
        //Data contains jwt of user
        let primaryToken = req.headers['primary']
        let token = jwtHandler.parseAuthToken(primaryToken)
        let id = token.data.userId
        try {
            database.findUserById(id).then((user) => {
                if (user) {
                    req.user = user
                    next()
                }
            })
        } catch (err) {
            console.log(err)
        }
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
                    let jwtToken = jwtHandler.generateSecondaryAuthToken(req.user._id)
                    res.set('secondaryToken', jwtToken)
                    res.send(true)
                }
            }
        })
    })

    return router
}


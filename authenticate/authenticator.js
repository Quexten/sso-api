let jwt = require('jsonwebtoken')


let primaryAuthenticators = []
primaryAuthenticators["mail"] = require("./mailAuthenticator")
primaryAuthenticators["test"] = require("./primary/test")

let secondaryAuthenticators = []
prim


//Primary auth token, validates possesion of
//the primary factor, and can be exchanged for
//the sessiontoken using the second factor.
function generatePrimaryAuthToken (userId, authType, authId) {
    jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 10),
        data: {
            userId: userId,
            authType: authType,
            authId: authId
        }
    }, 'secret');
}

module.exports = function (database) {
    let sessionGenerator = require('./sessionGenerator')(database)

    const express = require('express')
    const router = express.Router()

    router.get("/:authenticator/signin", (req, res) => {
        let authenticatorType = req.params.authenticator
        authenticators[authenticatorType](req, res, function (id, response) {
            //Id is established, might require a second factor of auth.
            database.findUserByAuthenticator(authenticatorType, id, (err, user) => {
                sessionGenerator.createSession(user._id, req, res, (err, succ) => {
                    res.redirect(req.query.redirectUri)
                })
            })
        })
    })
    router.get("/:authenticator/callback", (req, res) => {
        let authenticatorType = req.params.authenticator
        let id = authenticators[authenticatorType].callback(req, res)
        //Id is established, might require a second factor of auth.
        database.findUserByAuthenticator(authenticatorType, id, (err, user) => {

        })
    })

    router.get("/:authenticator/exchangePrimaryToken", (req, res) => {
        sessionGenerator.createSession(user._id, req, res, (err, succ) => {
            res.send("o")
            //res.redirect(req.query.redirectUri)
        })
    })


    return router
}


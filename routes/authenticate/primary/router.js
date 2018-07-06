let express = require('express')
let router = express.Router()

module.exports = function(database, primaryAuthenticator) {

    router.post('/:authenticator', (req, res) => {
        let authenticatorType = req.params.authenticator
        let authenticatorData = req.body
        primaryAuthenticator.requestAuthentication(authenticatorType, authenticatorData)
    })

    router.post('/:authenticator/callback', (req, res) => {
        let authenticatorType = req.params.authenticator
        let authenticatorData = req.body
        primaryAuthenticator.verifyAuthentication(authenticatorType, authenticatorData)
    })

    return router
}


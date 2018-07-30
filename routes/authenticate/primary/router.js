let express = require('express')
let router = express.Router()

module.exports = function(database, primaryAuthenticator) {

    router.post('/:authenticator', async (req, res) => {
        let authenticatorType = req.params.authenticator
        let authenticatorData = req.body
        await primaryAuthenticator.requestAuthentication(authenticatorType, authenticatorData)
        res.send('ok')
    })

    router.post('/:authenticator/callback', async (req, res) => {
        let authenticatorType = req.params.authenticator
        let authenticatorData = req.body
        try {
            let { user, token } = await primaryAuthenticator.verifyAuthentication(authenticatorType, authenticatorData)
            let secondFactors = user.authentication.secondary.map((factor) => factor.id)
            res.send({
                secondFactors,
                token
            })
        } catch (err) {
            res.send({
                error: 'Could not authenticate'
            })
        }
    })

    return router
}
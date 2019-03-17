import express from 'express'
let router = express.Router()

import fido2 from '../../../authenticate/secondary/fido2'
fido2()

export default function(secondaryAuthenticator) {

    router.get("/totp/new", async (req, res) => {
        let test = await secondaryAuthenticator.create("totp")
        res.send(test)
    })
    router.get("/codes/new", async (req, res) => {
        let codes = await secondaryAuthenticator.create("codes")
        res.send(codes)
    })
    router.get("/webauthn/register", async (req, res) => {
        let result = await fido2()
        res.send("aoeu")
    })
    /*router.post('/:authenticator', (req, res) => {
        let authenticatorType = req.params.authenticator
        let authenticatorData = req.body
        secondaryAuthenticator.requestAuthentication(authenticatorType, authenticatorData)
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
    })*/

    return router
}
import {ensureIsOwner} from "../../../security";

module.exports = function (auditApi, userApi, authApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.post('/new', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId
            let token = req.primaryAuthenticator
            await authApi.addPrimaryAuthenticator(userId, token)
            res.send('ok')
        } catch (err) {
            res.send('error')
        }
    })

    router.get('/', ensureIsOwner, async (req, res) => {
        res.send(await authApi.listPrimaryAuthenticators(req.params.userId))
    })

    router.get('/:primaryAuthenticatorId', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId

            res.send(audit)
        } catch (err) {
            res.error('error')
        }
    })

    router.delete('/:primaryAuthenticatorId', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId

            res.send(audit)
        } catch (err) {
            res.error('error')
        }
    })

    return router
}

import {ensureIsOwner} from "../../../security";

module.exports = function (auditApi, userApi, authApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.post('/new', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId
            let token = req.primaryAuthenticator
            if (token == null) {
                res.status(400).send({
                    error: 'Missing token'
                })
                return
            }

            //Test if authenticator is already registered
            let user = await authApi.findUserByAuthenticator(token.id, token.type)
            if (user != null) {
                res.status(400).send({
                    error: 'Authenticator already registered.'
                })
                return
            }

            await authApi.addPrimaryAuthenticator(userId, token)
            await auditApi.pushEvent (userId, {}, 'com.quexten.sso.addPrimaryAuthenticator', req.sender, req.userAgent)
            res.status(201).send(token)
        } catch (err) {
            res.status(403).send({
                error: 'User lacks permissions'
            })
        }
    })

    router.get('/', ensureIsOwner, async (req, res) => {
        res.send(await authApi.listPrimaryAuthenticators(req.params.userId))
    })

    router.get('/:primaryAuthenticatorId', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId
            res.send(userId)
        } catch (err) {
            res.error('error')
        }
    })

    router.delete('/:primaryAuthenticatorId', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId
            res.send(userId)
        } catch (err) {
            res.error('error')
        }
    })

    return router
}

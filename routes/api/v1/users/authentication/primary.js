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
            await authApi.addPrimaryAuthenticator(userId, token)
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

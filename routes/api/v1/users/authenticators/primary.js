module.exports = function (auditApi, userApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.get('/', async (req, res) => {
        try {
            let userId = req.params.userId

            res.send({})
        } catch (err) {
            res.error('error')
        }
    })

    router.post('/new', async (req, res) => {
        try {
            let user = await userApi.createUser()
            res.send(user)
        } catch (err) {
            res.error('error')
        }
    })

    router.get('/:primaryAuthenticatorId', async (req, res) => {
        try {
            let userId = req.params.userId

            res.send(audit)
        } catch (err) {
            res.error('error')
        }
    })

    router.delete('/:primaryAuthenticatorId', async (req, res) => {
        try {
            let userId = req.params.userId

            res.send(audit)
        } catch (err) {
            res.error('error')
        }
    })

    return router
}

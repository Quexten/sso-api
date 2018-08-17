module.exports = function (profileApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.get('/', async (req, res) => {
        try {
            let profile = await profileApi.get(parseInt(req.params.userId))
            res.send(profile)
        } catch (err) {
            res.send('error: could not find profile')
        }
    })

    router.post('/', async (req, res) => {
        try {
            let userId = req.params.userId
            let requestBody = req.body

            let username = requestBody.username
            let profile = await profileApi.updateUsername(userId, username)

            res.send(profile)
        } catch (err) {
            res.send('error: could not find profile')
        }
    })

    return router
}

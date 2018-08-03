module.exports = function (profileApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.get('/', async (req, res) => {
        try {
            let profile = await profileApi.get(parseInt(req.params.id))
            res.send(profile)
        } catch (err) {
            res.send('error: could not find profile')
        }
    })
    router.post('/', async (req, res) => {
        //TODO add authentication
        try {
            let body = req.body
            let username = body.username

            let profileBody = await profileApi.get(req.params.id)
            profileBody.username = username
            let user = await profileApi.update(req.params.id, profileBody)
            res.send(user.profile)
        } catch (err) {
            res.send('error: could not find profile')
        }
    })

    return router
}

import {ensureIsOwner} from "../../security";

module.exports = function (profileApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.get('/', async (req, res) => {
        try {
            let profile = await profileApi.get(req.params.userId)
            res.status(200).send(profile)
        } catch (err) {
            res.status(404).send({
                error: 'No user found under the supplied userId.'
            })
        }
    })

    router.post('/', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId
            let requestBody = req.body

            let username = requestBody.username
            let profile = await profileApi.updateUsername(userId, username)

            res.status(200).send(profile)
        } catch (err) {
            res.status(404).send({
                error: 'No user found under the supplied userId'
            })
        }
    })

    return router
}

import {ensureIsOwner} from "../../security";
import express from 'express'

export default function (profileApi) {
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

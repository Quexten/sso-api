import {ensureIsOwner} from "../../security";
import express from 'express'

export default function (auditApi) {
    const router = express.Router({ mergeParams: true })

    router.get('/', ensureIsOwner, async (req, res) => {
        try {
            let userId = req.params.userId
            let audit = await auditApi.listEvents(userId)
            res.send(audit)
        } catch (err) {
            res.status(500).send({
                error: "Error getting events."
            })
        }
    })

    return router
}

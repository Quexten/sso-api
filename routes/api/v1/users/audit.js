module.exports = function (auditApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.get('/', async (req, res) => {
        try {
            let userId = req.params.userId
            let audit = await auditApi.listEvents(userId)
            res.send(audit)
        } catch (err) {
            res.send('error')
        }
    })

    return router
}

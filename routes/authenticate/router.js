module.exports = (database, primaryAuthenticator, secondaryAuthenticator, sessionHandler) => {
    const express = require('express')
    const router = express.Router()

    router.use("/primary", require("./primary/router")(database, primaryAuthenticator))
    router.use("/secondary", require("./secondary/router")(database, secondaryAuthenticator))
    router.post("/exchange", async (req, res) => {
        let primaryToken = req.body.primary
        let secondaryToken = req.body.secondary

        try {
            let userId = await sessionHandler.validateExchange(primaryToken, secondaryToken)
            let useragent = req.get('User-Agent')
            let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress)
            let sessionInfo = await sessionHandler.createSession(userId, useragent, ip)
            res.send(sessionInfo)
        } catch (err) {
            res.send({
                error: "Could not validate exchange"
            })
        }
    })
    return router
}
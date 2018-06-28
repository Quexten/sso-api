module.exports = (database) => {
    let jwtHandler = require('./jwtHandler')('secret')
    const express = require('express')
    const router = express.Router()
    let sessionGenerator = require('./sessionGenerator')(database)

    router.use("/secondary", require("./secondary/router")(jwtHandler, database))
    router.use("/primary", require("./primary/router")(jwtHandler, database))
    router.get("/exchange", (req, res) => {
        let primaryToken = req.headers['primary']
        let secondaryToken = req.headers['secondary']

        if (jwtHandler.validateAuthToken(primaryToken)
            && jwtHandler.validateAuthToken(secondaryToken)) {

            sessionGenerator.createSession(jwtHandler.parseAuthToken(primaryToken).userId,
                req, res, (err, res) => {
                    res.send("{ success: true }")
                })
        }
    })
    return router
}
module.exports = (database) => {
    const express = require('express')
    const router = express.Router()

    router.use("/primary", require("./primary/router")(database))
    router.use("/secondary", require("./secondary/router")(database))
    router.get("/exchange", (req, res) => {
        let primaryToken = req.headers['primary']
        let secondaryToken = req.headers['secondary']

        if (jwtHandler.validateAuthToken(primaryToken)
            && jwtHandler.validateAuthToken(secondaryToken)) {

        }
    })
    return router
}
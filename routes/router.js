module.exports = function (database, primaryController, secondaryController, sessionHandler, profileApi) {
    const express = require('express')
    const router = express.Router()

    router.use("/api", require("./api/router")(profileApi))
    router.use("/auth", require("./authenticate/router")(database, primaryController, secondaryController, sessionHandler))

    return router
}


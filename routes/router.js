module.exports = function (database, secondaryController, sessionHandler, profileApi, auditApi, userApi, jwtHandler, authApi) {
    const express = require('express')
    const router = express.Router()

    router.use("/api", require("./api/router")(auditApi, userApi, profileApi, jwtHandler, authApi))
    //router.use("/auth", require("./authenticate/router")(database, primaryController, secondaryController, sessionHandler))

    return router
}


module.exports = function (auditApi, userApi, profileApi, jwtHandler, authApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.use("/v1/users", require("./v1/users/router")(auditApi, userApi, profileApi, jwtHandler, authApi))
    return router
}


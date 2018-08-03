module.exports = function (profileApi) {
    const express = require('express')
    const router = express.Router()

    router.use("/v1/users", require("./v1/users/router")(profileApi))

    return router
}


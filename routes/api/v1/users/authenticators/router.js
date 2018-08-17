module.exports = function (auditApi, userApi, profileApi) {
    const express = require('express')
    const router = express.Router()

    router.use('/primary', require('./primary')(auditApi))
    router.use("/secondary", require("./secondary")(profileApi))

    return router
}


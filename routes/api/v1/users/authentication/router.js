module.exports = function (auditApi, userApi, authApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.use('/primary', require('./primary')(auditApi, userApi, authApi))
    return router
}


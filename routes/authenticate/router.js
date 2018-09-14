module.exports = (primaryAuthMiddleware) => {
    const express = require('express')
    const router = express.Router()

    router.use("/primary", require("./primary/router")(primaryAuthMiddleware))

    return router
}

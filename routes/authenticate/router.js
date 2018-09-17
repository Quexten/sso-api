module.exports = (primaryAuthMiddleware, sessionRouter) => {
    const express = require('express')
    const router = express.Router()

    router.use("/primary", require("./primary/router")(primaryAuthMiddleware))
    router.use('/exchange', sessionRouter)

    return router
}

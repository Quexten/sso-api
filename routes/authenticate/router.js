module.exports = (database, primaryAuthenticator, secondaryAuthenticator, sessionHandler) => {
    const express = require('express')
    const router = express.Router()

    router.use("/primary", require("./primary/router")(database, primaryAuthenticator))


    return router
}

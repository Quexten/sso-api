module.exports = function (database) {
    const express = require('express')
    const router = express.Router()

    router.use("/users", require("./users/router")(database))
    
    return router
}


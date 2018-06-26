let express = require('express')
let router = express.Router()

let authenticators = []

module.exports = function (database) {
    router.get("/:authenticator/signIn", (req, res) => {
        let authenticatorType = req.params.authenticator
        secondaryAuthenticators[authenticatorType].create(req, res, (user) => {
            database.updateUser(user._id, user)
        })
    })

    return router
}


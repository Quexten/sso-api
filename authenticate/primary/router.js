let test = require('./test')
let express = require('express')
let router = express.Router()

let authenticators = []
authenticators['test'] = test

module.exports = function (jwtHandler, database) {
    router.get("/:authenticator/signIn", (req, res) => {
        let authenticatorType = req.params.authenticator
        authenticators[authenticatorType].signIn(req, database, (user) => {
            database.updateUser(user._id, user)

            let jwtToken = jwtHandler.generatePrimaryAuthToken(user._id)
            res.set('primaryToken', jwtToken)


            let secondaryAuthenticators = []
            user.auth.secondary.forEach((authenticator) => {
                if(secondaryAuthenticators.indexOf(authenticator.authenticatorId) == -1)
                    secondaryAuthenticators.push(authenticator.authenticatorId)
            })
            if (secondaryAuthenticators.length == 0)
                secondaryAuthenticators.push('none')

            res.send({
                success: true,
                secondaryAuthenticators: secondaryAuthenticators
            })
        })
    })

    return router
}


import express from 'express'
const router = express.Router()

export function sessionHandler (database, jwtHandler, auditApi) {

    router.post('/', async (req, res) => {
        let primaryAuthenticator = req.primaryAuthenticator

        let user = await database.findUserByPrimaryAuthenticatorId(primaryAuthenticator.type, primaryAuthenticator.id)
        let userId = user._id

        let sessionData = {
            userId: userId,
            tokenType: 'sessionToken'
        }

        let sessionToken = await jwtHandler.generateToken(sessionData)
        res.send({
            token: sessionToken
        })

    })

    return router
}

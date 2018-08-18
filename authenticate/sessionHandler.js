module.exports = async (database, app, jwtHandler, auditApi) => {

    app.post('/auth/exchange', async (req, res) => {
        let primaryAuthToken = req.body.primaryAuthToken
        let secondaryAuthToken = req.body.secondaryAuthToken
        if (!jwtHandler.validateToken(primaryAuthToken)) {
            res.send('error')
            return
        }

        let parsedPrimaryAuthToken = jwtHandler.parseToken(primaryAuthToken)
        if (!(parsedPrimaryAuthToken.tokenType === 'primaryAuthToken')) {
            res.send('error')
            return
        }

        let user = await database.findUserByPrimaryAuthenticatorId(parsedPrimaryAuthToken.primaryAuthenticator.type, parsedPrimaryAuthToken.primaryAuthenticator.id)
        let userId = user._id

        let sessionData = {
            userId: userId,
            tokenType: 'sessionToken'
        }

        let sessionToken = jwtHandler.generateToken(sessionData)
        res.send({
            token: sessionToken
        })

    })
}

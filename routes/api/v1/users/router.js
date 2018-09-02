let ensureUserIsAuthenticated = (req, res, next) => {
    if (req.userId === parseInt(req.params.userId))
        next()
    else
        res.send('error')
}

module.exports = function (auditApi, userApi, profileApi, jwtHandler, authApi) {
    const express = require('express')
    const router = express.Router()

    router.get('/', async (req, res) => {
        let userArray = await userApi.getUsers()
        userArray = userArray.map((user) => user.profile)
        res.send({
            users: userArray
        })
    })
    router.get('/:userId', async (req, res) => {
        let userId = req.params.userId
        let user = await userApi.getUser(userId)

        if ((req.userId !== parseInt(req.params.userId)) && req.userId !== req.params.userId )
            user = user.profile

        res.send(user)
    })
    router.delete('/:userId', ensureUserIsAuthenticated, async (req, res) => {
        let userId = req.params.userId
        await userApi.deleteUser(userId)
        res.send('ok')
    })
    router.post('/new', async (req, res) => {
        let primaryAuthToken = req.body.token

        if (!jwtHandler.validateToken(primaryAuthToken)) {
            res.send('error')
            return
        }
        let parsedToken = jwtHandler.parseToken(primaryAuthToken)
        if (parsedToken.tokenType !== 'primaryAuthToken') {
            res.send('error')
            return
        }

        let user = await userApi.createUser()
        await auditApi.pushEvent(user._id, { userId: user._id }, 'com.quexten.sso.createUser', req.sender, res.userAgent)
        await authApi.addPrimaryAuthenticator(user._id, parsedToken.primaryAuthenticator)
        await auditApi.pushEvent(user._id, {
            authenticatorId: parsedToken.primaryAuthenticator.id,
            authenticatorType: parsedToken.strategy
        }, 'com.quexten.sso.addPrimaryAuthenticator', req.sender, res.userAgent)
        await profileApi.updateAvatar(user._id, parsedToken.primaryAuthenticator.avatar)
        res.send(user)
    })

    router.use('/:userId/audit', ensureUserIsAuthenticated, require('./audit')(auditApi))
    router.use("/:userId/profile", require("./profile")(profileApi))
    router.use('/:userId/sessions', ensureUserIsAuthenticated, require('./sessions'))

    return router
}


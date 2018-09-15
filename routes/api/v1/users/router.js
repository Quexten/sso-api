import { ensureIsOwner } from '../../security'

module.exports = function (auditApi, userApi, profileApi, jwtHandler, authApi) {
    const express = require('express')
    const router = express.Router({ mergeParams: true })

    router.get('/', async (req, res) => {
        if (req.userId === undefined) {
            res.status(403).send('Missing user authentication.')
            return
        }

        let requestingUser = await userApi.getUser(req.userId)
        if (!requestingUser.profile.admin) {
            res.status(403).send("User doesn't have permission to access this resource.")
            return
        }

        let userArray = await userApi.getUsers()

        //userArray = userArray.map((user) => user.profile)
        res.send({
            users: userArray
        })
    })
    router.get('/:userId', ensureIsOwner, async (req, res) => {
        let userId = req.params.userId
        let user = await userApi.getUser(userId)

        if ((req.userId !== parseInt(req.params.userId)) && req.userId !== req.params.userId )
            user = user.profile

        res.send(user)
    })
    router.delete('/:userId', ensureIsOwner, async (req, res) => {
        let userId = req.params.userId
        await userApi.deleteUser(userId)
        res.status(204).send()
    })
    router.post('/new', async (req, res) => {
        let primaryAuthToken = req.body.token

        if (!jwtHandler.validateToken(primaryAuthToken)) {
            res.status(403).send({
              error: 'Supplied authentication token is invalid.'
            })
            return
        }
        let parsedToken = jwtHandler.parseToken(primaryAuthToken)
        if (parsedToken.tokenType !== 'primaryAuthToken') {
            res.status(403).send({
                error: 'Supplied token has incorrect type.'
            })
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
        res.status(201).send(user)
    })

    router.use('/:userId/audit', require('./audit')(auditApi))
    router.use("/:userId/profile", require("./profile")(profileApi))
    router.use('/:userId/authenticators/', require('./authentication/router')(auditApi, userApi, authApi))

    return router
}


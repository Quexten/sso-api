import express from 'express'
import primaryRoute from './primary/router'
import secondaryRoute from './secondary/router'


export default (primaryAuthMiddleware, sessionRouter, secondaryAuthenticator) => {
    const router = express.Router()

    router.use("/primary", primaryRoute(primaryAuthMiddleware))
    router.use("/secondary", secondaryRoute(secondaryAuthenticator))
    router.use('/exchange', sessionRouter)

    return router
}

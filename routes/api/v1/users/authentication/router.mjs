import primaryRoute from './primary'
import express from 'express'

export default function (auditApi, userApi, authApi) {
    const router = express.Router({ mergeParams: true })

    router.use('/primary', primaryRoute(auditApi, userApi, authApi))
    return router
}


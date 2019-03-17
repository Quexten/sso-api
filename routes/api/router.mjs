import express from 'express'
import userRouter from './v1/users/router'

export default function (auditApi, userApi, profileApi, jwtHandler, authApi) {
    const router = express.Router({ mergeParams: true })

    router.use("/v1/users", userRouter(auditApi, userApi, profileApi, jwtHandler, authApi))
    return router
}


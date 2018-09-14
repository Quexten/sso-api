import config from './config/config'
import Database from './db/mongodbDatabase'
import JwtHandler from './authenticate/jwtHandler'
import AvatarApi from './users/s3AvatarApi'
import ProfileApi from './users/profileApi'
import AuditApi from './users/auditApi'
import UserApi from './users/userApi'
import AuthApi from './users/authenticationApi'
import Server from './server'
import passportAuthMiddleware from './authenticate/passportAuthenticationMiddleware'
import apiRouter from './routes/api/router'

(async () => {
    //Set up apis & dependencies, and wire them together
    let database = new Database(config.mongodb.url)
    await database.connect(config.mongodb.url)

    let jwtHandler = new JwtHandler(config.jwtHandler.secret)
    let avatarApi = new AvatarApi(config.aws)
    let profileApi = new ProfileApi(database, avatarApi)
    let auditApi = new AuditApi(database)
    let userApi = new UserApi(database)
    let authApi = new AuthApi(database)
    let primaryAuthMiddleware = passportAuthMiddleware(config.authentication.primary, database, jwtHandler)
    let restRouter = apiRouter(auditApi, userApi, profileApi, jwtHandler, authApi)

    let server = new Server(config.api, jwtHandler, primaryAuthMiddleware, restRouter)
    server.start()
})()

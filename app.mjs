import fs from 'fs'
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
import { sessionHandler } from './authenticate/sessionRouter'
import secondaryAuth from './authenticate/secondary/secondaryAuthenticator'

(async () => {
    let config;
    if (process.env.config == null) {
      config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'))
    } else {
      config = JSON.parse(process.env.config)
    }
    //Set up apis & dependencies, and wire them together
    let database = new Database(config.mongodb.url)
    await database.connect(config.mongodb.url)
    let jwtHandler = new JwtHandler(config.jwtHandler.secret)
    let avatarApi = new AvatarApi(config.aws)
    let profileApi = new ProfileApi(database, avatarApi)
    let auditApi = new AuditApi(database)
    let userApi = new UserApi(database)
    let authApi = new AuthApi(database)
    let secondaryAuthenticator = new secondaryAuth(database, jwtHandler)

    let primaryAuthMiddleware = passportAuthMiddleware(config.authentication.primary, database, jwtHandler)
    let restRouter = apiRouter(auditApi, userApi, profileApi, jwtHandler, authApi)
    let sessionRouter = sessionHandler(database, jwtHandler, auditApi)
    let server = new Server(config.api, jwtHandler, primaryAuthMiddleware, sessionRouter, restRouter, secondaryAuthenticator)
    server.start()

})()

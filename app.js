import config from './config/config'
import Database from './db/mongodbDatabase'
import JwtHandler from './authenticate/jwtHandler'
import AvatarApi from './users/s3AvatarApi'
import ProfileApi from './users/profileApi'
import AuditApi from './users/auditApi'
import UserApi from './users/userApi'
import AuthApi from './users/authenticationApi'

(async () => {
    let database = await Database(config.mongodb.url)
    let jwtHandler = await JwtHandler(config.jwtHandler.secret)
    let avatarApi = await AvatarApi(config.aws)
    let profileApi = await ProfileApi(database, avatarApi)
    let auditApi = await AuditApi(database)
    let userApi = await UserApi(database)
    let authApi = await AuthApi(database)


})()
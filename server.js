
import SecondaryController from './authenticate/secondary/secondaryAuthenticator'
import MongoDatabase from "./db/mongodbDatabase";

let app = async () => {
    //Set up utilities
    //let database = require('./test/db/mockdb')()
    let database = new MongoDatabase()
    await database.connect('mongodb://localhost:27017/sso-api?retryWrites=true')


    let sessionHandler = require('./authenticate/sessionHandler')(database, app, jwtHandler, auditApi)

    let authApi = await AuthApi(database)
    require('./authenticate/strategyRegister')(database, app, config.authentication.primary)

    //Rest Signin Api
    let express = require('express')
    let app = express()
    app.use((req, res, next) => {
        req.sender = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        next()
    })
    app.use((req, res, next) => {
        res.userAgent = req.get('User-Agent')

        next()
    })
    //Middlewares
    app.use(require('cors')({
        origin: config.api.origin
    }))
    app.use(require('cookie-parser')())
    app.use(require('body-parser').urlencoded({ extended: true }))
    app.use(require('body-parser').json())
    app.use((req, res, next) => {
        let sessionToken = req.headers['session-token']
        if (sessionToken !== null && jwtHandler.validateToken(sessionToken)) {
            let session = jwtHandler.parseToken(sessionToken)
            if (session.data.tokenType === 'sessionToken') {
                req.userId = session.data.userId
            }
        }

        next()

    })

    app.use('/', require('./routes/router')(database, secondaryController, sessionHandler, profileApi, auditApi, userApi, jwtHandler, authApi))
    //Routers
    app.listen(config.api.port)
    console.log('listening on port: ' + config.api.port)

}
app()
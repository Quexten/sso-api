let app = async () => {
    //Load config
    let config = require('./config/config.js')

    //Set up utilities
    let database = require('./test/db/mockdb')()

    let jwtHandler = require('./authenticate/jwtHandler')(config.jwtHandler.secret)
    //Set up api's
    let avatarApi = await require('./users/avatarApi')(config.aws)

    let profileApi = await require('./users/profileApi')(database, avatarApi)
    let auditApi = await require('./users/auditApi')(database)
    let userApi = await require('./users/userApi')(database)
    let authApi = await require('./users/authenticationApi')(database)


    //Set up authentication
    //Primary
    //let primaryController = require('./authenticate/primary/controller')(database, jwtHandler)

   // let MailAuthenticator = require('./authenticate/primary/mailAuthenticator')
   // primaryController.registerAuthenticator('mail', new MailAuthenticator(config.primary.mailgun, jwtHandler) )

    //Secondary
    let secondaryController = require('./authenticate/secondary/secondaryAuthenticator', config.secondary)


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


    let sessionHandler = require('./authenticate/sessionHandler')(database, app, jwtHandler, auditApi)

    app.use('/', require('./routes/router')(database, secondaryController, sessionHandler, profileApi, auditApi, userApi, jwtHandler, authApi))

    //Routers
    app.listen(config.api.port)
    console.log('listening on port: ' + config.api.port)
    //require('./users/imageImporter')(config.aws).setUserImage(54555, 'https://s.gravatar.com/avatar/b2e0cbf930a9ccfb0494b56f5d8f9a1b?s=512')
    require('./authenticate/strategyRegister')(database, app, config.authentication.primary)

}
app()

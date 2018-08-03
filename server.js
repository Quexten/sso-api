let app = async () => {
    //Load config
    let config = require('./config/config.js')

    //Set up utilities
    let database = require('./test/db/mockdb')()
    let jwtHandler = require('./authenticate/jwtHandler')(config.jwtHandler.secret)
    let sessionHandler = require('./authenticate/sessionHandler')(database, jwtHandler)

    //Set up api's
    let profileApi = await require('./users/profileApi')(database)


    //Set up authentication
    //Primary
    let primaryController = require('./authenticate/primary/controller')(database, jwtHandler)

    let MailAuthenticator = require('./authenticate/primary/mailAuthenticator')
    primaryController.registerAuthenticator('mail', new MailAuthenticator(config.primary.mailgun, jwtHandler) )

    //Secondary
    let secondaryController = require('./authenticate/secondary/secondaryAuthenticator', config.secondary)


    //Rest Signin Api
    let express = require('express')
    let app = express()

    //Middlewares
    app.use(require('cors')({
        origin: config.api.origin
    }))
    app.use(require('cookie-parser')())
    app.use(require('body-parser').urlencoded({ extended: true }))
    app.use(require('body-parser').json())

    app.use('/', require('./routes/router')(database, primaryController, secondaryController, sessionHandler, profileApi))

    //Routers
    app.listen(config.api.port)
    console.log('listening on port: ' + config.api.port)
}
app()

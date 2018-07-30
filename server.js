let config = require('./config/config.js')

//Utility
let database = require('./test/db/mockdb')()
let jwtHandler = require('./authenticate/jwtHandler')(config.jwtHandler.secret)
let sessionHandler = require('./authenticate/sessionHandler')(database, jwtHandler)

//Authentication
let primaryController = require('./authenticate/primary/controller')(database, jwtHandler)

let MailAuthenticator = require('./authenticate/primary/mailAuthenticator')
primaryController.registerAuthenticator('mail', new MailAuthenticator(config.primary.mailgun, jwtHandler) )

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

app.use('/authenticate', require('./routes/authenticate/router')(database, primaryController, secondaryController, sessionHandler))

//Routers
app.listen(config.api.port)
console.log('listening on ' + config.api.port)
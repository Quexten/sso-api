let express = require('express')
let app = express()

let database = require('./test/db/mockdb')()

let jwtHandler = require('./authenticate/jwtHandler')('test')
let sessionHandler = require('./authenticate/sessionHandler')(database, jwtHandler)

let secondaryAuthenticator = require('./authenticate/secondary/secondaryAuthenticator')

//Middlewares
app.use(require('cors')({
    origin: 'http://localhost:1024'
}))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('body-parser').json())

app.use('/authenticate', require('./routes/authenticate/router')(database,primaryAuthenticator, secondaryAuthenticator, sessionHandler))

//Routers
app.listen(3000)
console.log('listening on 3000')
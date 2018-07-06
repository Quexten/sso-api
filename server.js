let express = require('express')
let app = express()


let primaryAuthenticator = require('./authenticate/primary/primaryAuthenticator')
let secondaryAuthenticator = require('./authenticate/secondary/secondaryAuthenticator')


//Middlewares
app.use(require('cors')({
    origin: 'http://localhost:1024'
}))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('body-parser').json())

app.use('/authenticate', require('./routes/authenticate/router'))

//Routers
app.listen(3000)
console.log('listening on 3000')


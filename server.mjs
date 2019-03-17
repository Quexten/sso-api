import express from 'express'
import authenticationRouter from './routes/authenticate/router'
import https from 'https'
import fs from 'fs'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

export default class Server {

    constructor (config, jwtHandler, primaryAuthenticationMiddleware, sessionRouter, restRouter, secondaryAuthenticator) {
        //Rest Signin Api
        this.config = config
        this.app = express()

        //Middlewares
        this.app.use((req, res, next) => {
            req.sender = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            req.userAgent = req.get('User-Agent')
            next()
        })
        this.app.use(cors({
            origin: config.origin
        }))
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
        this.app.use(cookieParser())
        this.app.use(async (req, res, next) => {
            //For security, all validation of authentication claims
            //Like primary tokens, secondary tokens, or session tokens
            //Are validated here, and stored inside the request, to
            //minimize the amount of potentially vulnerable LoC

            let sessionToken = req.headers['session-token']
            let primaryAuthenticationToken = req.body.primaryAuthenticationToken
            let secondaryAuthenticationToken = req.body.secondaryAuthenticationToken

            if (sessionToken !== undefined && await jwtHandler.validateToken(sessionToken)) {
                let session = await jwtHandler.parseToken(sessionToken)
                if (session.tokenType === 'sessionToken') {
                    req.userId = session.userId
                }
            }

            if (primaryAuthenticationToken !== undefined && await jwtHandler.validateToken(primaryAuthenticationToken)) {
                let primaryAuthenticator = await jwtHandler.parseToken(primaryAuthenticationToken)
                if (primaryAuthenticator.tokenType === 'primaryAuthToken') {
                    req.primaryAuthenticator = primaryAuthenticator.primaryAuthenticator
                }
            }

            next()
        })

        this.app.use('/authenticate', authenticationRouter(primaryAuthenticationMiddleware, sessionRouter, secondaryAuthenticator))
        this.app.use('/api', restRouter)
    }

    start () {
        console.log("starting https")
        https.createServer({
            key: fs.readFileSync('./key.pem'),
            cert: fs.readFileSync('./cert.pem')
        } ,this.app).listen(this.config.port)
        console.log(`listening on port: ${this.config.port}`)
    }

}

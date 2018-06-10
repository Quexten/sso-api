const {MongoClient, ObjectId} = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const nodeify = require('nodeify')
const ooth = require('./ooth')

const prepare = (o) => {
    if (o && o._id) {
        o._id = o._id.toString()
    }
    return o
}

function nodeifyAsync(asyncFunction) {
    return function(...args) {
        return nodeify(asyncFunction(...args.slice(0, -1)), args[args.length-1])
    }
}

const start = async (app, settings) => {
    let db;
    try {
        db = await MongoClient.connect(settings.mongoUrl)
        app.use(morgan('dev'))

        const corsMiddleware = cors({
            origin: settings.originUrl,
            credentials: true,
            preflightContinue: false
        })
        app.use(corsMiddleware)
        app.options(corsMiddleware)

        app.use(session({
            name: 'api-session-id',
            secret: settings.sessionSecret,
            resave: false,
            saveUninitialized: true,
        }))
        await ooth(app, settings)
    } catch (e) {
        if (db) {
            db.close();
        }
        throw e;
    }
}

module.exports = {
    start
}

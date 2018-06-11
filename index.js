const express = require('express')
const settings = require('./settings/settings.js')
const api = require("./api")

const dev = process.env.NODE_ENV !== 'prod'

const start = async () => {
    try {
        const app = express()
        await api.start(app, settings)
        await app.listen(settings.port)
        console.log(`Online at ${settings.url}:${settings.port}`)
    } catch (e) {
        console.error(e)
    }
}

start()

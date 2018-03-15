const next = require('next')
const express = require('express')
const settings = require('./settings/settings.js')
const api = require("./api")

const dev = process.env.NODE_ENV !== 'prod'

const start = async () => {
    try {
        const app = express()
		app.use(function(req, res, next) {
		  res.header("Access-Control-Allow-Origin", "*");
		  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		  next();
		});
        await api.start(app, settings)

        const nextApp = next({
            dev
        })
        const handle = nextApp.getRequestHandler()

        await nextApp.prepare()

        app.get('*', (req, res) => {
            console.log(req)
            return handle(req, res)
        })

        await app.listen(settings.port)

        console.log(`Online at ${settings.url}:${settings.port}`)
    } catch (e) {
        console.error(e)
    }
}

start()

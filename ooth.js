const express = require('express')
const Ooth = require('ooth')
const oothLocal = require('ooth-local')
const oothFacebook = require('./oothFacebook.js')
const oothGoogle = require('ooth-google')
const mail = require('./mail')
const {MongoClient, ObjectId} = require('mongodb')
const OothMongo = require('ooth-mongo')

const oothEmail = require('./email.js')
const oothProfile = require('ooth-profile')


const fs = require("fs")
var emailLogin = fs.readFileSync("./mails/emailLogin.html", "utf8")
var passwordReset = fs.readFileSync("./mails/passwordReset.html", "utf8")
var signup = fs.readFileSync("./mails/signup.html", "utf8")
var verifyEmail = fs.readFileSync("./mails/verifyEmail.html", "utf8")
var verifyEmailConfirmation = fs.readFileSync("./mails/verifyEmailConfirmation.html", "utf8")
var settings = ''

module.exports = async function start(app, settings) {
    this.settings = settings
    this.sendMail = mail(settings.mailgun)

    const ooth = new Ooth({
        sharedSecret: settings.sharedSecret,
        standalone: settings.standalone,
        path: settings.oothPath
    })
    const db = await MongoClient.connect(settings.mongoUrl)
    const oothMongo = new OothMongo(db, ObjectId)

    await ooth.start(app, oothMongo)
    ooth.use('profile', oothProfile({
      fields: {
        username: {
          validate(value, user) {
            if (!/^([abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-]+)$/.test(value))
              throw new Error(`Only alphanumeric, and - _ are allowed.`)
            if (value.length > 25)
              throw new Errror('Max allowed length is 25 characters.')
          }
        }
      }
    }))
    ooth.use('facebook', oothFacebook(settings.facebook))
    ooth.use('google', oothGoogle(settings.google))
    ooth.use('email', oothEmail(function (id, email, loginToken) {
      const emailLoginLink = settings.originUrl + "/login-email-confirmation?token=" + loginToken + "&userId=" + id
      sendMail({
        from: settings.mail.from,
        to: email,
        subject: 'Email Login',
        body: 'Login with:' + emailLoginLink,
        html: emailLogin.replace(/REPLACELINK/g, emailLoginLink)
      })
    }))
}

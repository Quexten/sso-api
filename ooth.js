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
const md5 = require('js-md5');


const fs = require("fs")
var emailLogin = fs.readFileSync("./mails/emailLogin.html", "utf8")
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
        },
        avatar: {
          validate(value, user) {
            if (!(value === 'Google' || value === 'Facebook' || value === 'Email')) {
              throw new Error('Unavailable avatar selected')
            }
            if (user[value.toLowerCase()] == null) {
              throw new Error('User does not have the selected avatars authentication method')
            }
          }
        }
      }
    }))
    ooth.use('facebook', oothFacebook(settings.facebook))
    ooth.use('google', oothGoogle(settings.google))
    ooth.use('email', oothEmail(function (id, email, loginToken) {
      const emailLoginLink = settings.originUrl[0] + "/#/login-email-confirmation?token=" + loginToken + "&userId=" + id
      sendMail({
        from: settings.mail.from,
        to: email,
        subject: 'Email Login',
        body: 'Login with:' + emailLoginLink,
        html: emailLogin.replace(/REPLACELINK/g, emailLoginLink)
      })
    }))

    app.get('/profile/:id', (req, res) => {
      const id = req.params.id
      oothMongo.getUserById(id).then(user => {
        const timestamp = user._id.toString().substring(0,8)
        const created =  new Date( parseInt( timestamp, 16 ) * 1000 )
        const username = ('profile' in user) ? user.profile.username : null
        const avatar = ('profile' in user) ? user.profile.avatar : null
        var avatarUri = null
        if (avatar != null) {
          if (avatar == 'Email') {
            avatarUri = 'https://www.gravatar.com/avatar/' + md5(user.email.email.toLowerCase().trim() + "?s=1024")
          } else if (avatar == 'Google') {
            avatarUri = 'https://pikmail.herokuapp.com/' + user.google.email + '?size=1024'
          } else if (avatar == 'Facebook') {
            avatarUri = 'https://graph.facebook.com/' + user.facebook.id + '/picture?type=large'
          }
        }
        res.send({
          username,
          avatar: avatarUri,
          created
        })
      }).catch((err) => {
        res.send({
          error: "User does not exists."
        })
      })
    })

    app.get('/profiles', (req, res) => {
      db.collection('users').find({}).toArray(function(err, result) {
        if (err)  throw err;
        let resultArray = []
        result.forEach((element) => {
          const avatar = ('profile' in element) ? element.profile.avatar : null
          var avatarUri = null
          if (avatar != null) {
            if (avatar == 'Email') {
              avatarUri = 'https://www.gravatar.com/avatar/' + md5(elmeent.email.email.toLowerCase().trim())
            } else if (avatar == 'Google') {
              avatarUri = 'https://pikmail.herokuapp.com/' + element.google.email + '?size=200'
            } else if (avatar == 'Facebook') {
              avatarUri = 'https://graph.facebook.com/' + element.facebook.id + '/picture?type=large'
            }
          }
          resultArray.push({
            id : element._id,
            username: element.profile.username,
            avatar: avatarUri
          })
        })

        
        res.send(resultArray)
      })
    })

    app.post('/deleteUser', (req, res) => {
      const id = req.body.id
      try {
        db.collection('users').remove({ "_id" : ObjectId(id) }, (err, obj) => {
          if (err)
            res.send("error")
          else {
            res.send(obj)
          }
        })
      } catch (err) {
        res.send("incorrect object id passed")
      }
    })
    app.get('/audit/:id', (req, res) => {
      const id = req.params.id
      oothMongo.getUserById(id).then(user => {
        res.send({
          audit: user.audit
        })
      }).catch((err) => {
        res.send({
          error: "User does not exists."
        })
      })
    })
}

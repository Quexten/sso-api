let { Strategy } = require('passport-facebook');
const { AuthApp } = require('../passport-auth');
const { User } = require('../../models/index')
const { get } = require('lodash')

module.exports = function(app, { clientID, clientSecret }) {
  AuthApp(app,{
    credentials: { clientID, clientSecret },
    callbackURL: '/auth/facebook/callback',
    userModel: User,
    loginURL: '/auth/facebook',
    strategy:  Strategy,
    successRedirect: '/whoami',
    failureRedirect: '/',
    findBy: 'oauthID',
    defaultUser:{
      login: p=> p.emails[0].value,
      email: p=> p.emails[0].value,
      oauthID: p=> p.id,
      accessToken: p => p.accessToken
    },

    stratConfig: { profileFields: ['id', 'displayName', 'photos', 'email'] },
    authConfig: { 
      approval_prompt: 'force',
      accessType: 'offline',
      scope: ['public_profile'],
      showDialog: true
    } 
  })
}


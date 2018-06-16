let { Strategy } = require('passport-google-oauth20');
const { AuthApp } = require('../passport-auth');
const { User } = require('../../models/index')

module.exports = function(app, { clientID, clientSecret }) {
  AuthApp(app,{
    credentials: { clientID, clientSecret },
    callbackURL: '/google/callback',
    userModel: User,
    loginURL: '/google/login',
    strategy:  Strategy,
    successRedirect: '/whoami',
    failureRedirect: '/',
    findBy: 'oauthID',
    defaultUser:{
      login: p=> p.emails[0].value,
      email: p=> p.emails[0].value,
      oauthID: p=> p.id,
      accessToken: p => p.accessToken,
      refreshToken: p => p.refreshToken
    },

    authConfig: { 
      approval_prompt: 'force',
      accessType: 'offline',
      scope: [
        'openid',
        'email',
        'profile'
      ], 
      showDialog: false
    } 
  })
}

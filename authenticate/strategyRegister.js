module.exports = async (database, app, config) => {

    //Import
    let passport = require('passport')
    let GoogleStrategy = require('passport-google-oauth20').Strategy
    let MailStrategy = require('../passport/MailStrategy')
    let SteamStrategy = require('passport-steam').Strategy
    var DiscordStrategy = require('passport-discord').Strategy;
    let jwt = require('jsonwebtoken')

    let tokenForAuthenticator = async (authenticator, strategy) => {
        let secret = config.jwtSecret
        let user = await database.findUserByPrimaryAuthenticatorId(strategy, authenticator.id)
        let userId = null
        if (user !== null)
            userId = user._id

        let token = {
            primaryAuthenticator: authenticator,
            tokenType: "primaryAuthToken",
            strategy: strategy,
            userId: userId
        }
        return jwt.sign(token, secret)
    }

    //Register with passport
    passport.use(new MailStrategy(config.mailgun))

    passport.use(new GoogleStrategy(config.google,
        function(accessToken, refreshToken, profile, done) {
            let avatar = profile.photos[0].value
            avatar = avatar.substr(0, avatar.length - 6)
            done(null, {
                id: profile.id,
                avatar: avatar
            })
        }
    ))

    passport.use(new SteamStrategy(config.steam,
        function(identifier, profile, done) {
            done(null, {
                id: profile.id,
                avatar: profile.photos[2].value
            })
        }
    ))

    passport.use(new DiscordStrategy(config.discord,
        function(accessToken, refreshToken, profile, done) {
            let avatar = 'https://cdn.discordapp.com/avatars/'
                + profile.id
                + '/'
                + profile.avatar
                + '.png?size=1024'
            done(null, {
                id: profile.id,
                avatar: avatar
            })
        }))

    //Register with express
    app.use(passport.initialize());
    app.get('/auth/google',
        (req, res, next) => {
            res.cookie('redirect', req.query.redirect)
            next()
        },
        passport.authenticate('google', { scope: ['profile'], session: false }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login', session:false }),
        async (req, res) => {
            let redirect = req.cookies.redirect
            res.redirect(redirect + "?token=" + await tokenForAuthenticator(req.user, 'google'))
        })

    app.get('/auth/steam',
        (req, res, next) => {
            res.cookie('redirect', req.query.redirect)
            next()
        },
        passport.authenticate('steam', { session: false }),
        (req, res) => {});

    app.get('/auth/steam/return',
        passport.authenticate('steam', { failureRedirect: '/login',  session: false  }),
        async (req, res) => {
            let redirect = req.cookies.redirect
            res.redirect(redirect + "?token=" + await tokenForAuthenticator(req.user, 'steam'))
        })

    app.post('/auth/mail',
        passport.authenticate('mailgun', { session: false })
    )
    app.get('/auth/mail/callback',
        passport.authenticate('mailgun', {session: false}),
        (req, res) => {
            res.send(tokenForAuthenticator(req.user, 'mailgun'))
        })

    app.get('/auth/discord',
        (req, res, next) => {
            res.cookie('redirect', req.query.redirect)
            next()
        },
        passport.authenticate('discord', { session: false }))

    app.get('/auth/discord/callback', passport.authenticate('discord', {
        failureRedirect: '/',
        session: false
    }),  async (req, res) => {
        let redirect = req.cookies.redirect
        res.redirect(redirect + "?token=" + await tokenForAuthenticator(req.user, 'google'))
    });
}

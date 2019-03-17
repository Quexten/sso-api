import express from 'express'
const router = express.Router()
import passport from 'passport'
import googleauth from 'passport-google-oauth20'
const GoogleStrategy = googleauth.Strategy
import discordauth from 'passport-discord'
const DiscordStrategy = discordauth.Strategy
import steamauth from 'passport-steam'
const SteamStrategy = steamauth.Strategy
import MailStrategy from '../passport/MailStrategy'


export default (config, database, jwtHandler) => {

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
        return await jwtHandler.generateToken(token, secret)
    }

    //Register with passport
    passport.use(new MailStrategy(config.mailgun))

    passport.use(new GoogleStrategy(config.google,
        function(accessToken, refreshToken, profile, done) {
            let avatar = profile.photos[0].value
            avatar = avatar.substr(0, avatar.length)
            avatar = avatar + "?size=512"
            done(null, {
                id: profile.id,
                avatar: avatar,
                type: 'google'
            })
        }
    ))

    passport.use(new SteamStrategy(config.steam,
        function(identifier, profile, done) {
            done(null, {
                id: profile.id,
                avatar: profile.photos[2].value,
                type: 'steam'
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
                avatar: avatar,
                type: 'discord'
            })
        }))

    //Register with express
    router.use(passport.initialize())
    router.get('/google',
        (req, res, next) => {
            res.cookie('redirect', req.query.redirect)
            next()
        },
        passport.authenticate('google', { scope: ['profile'], session: false }))

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/login', session:false }),
        async (req, res) => {
            let redirect = req.cookies.redirect
            if (redirect !== "undefined") {
                res.redirect(redirect + "?token=" + await tokenForAuthenticator(req.user, 'google'))
            } else {
                let token = await tokenForAuthenticator(req.user, 'google')
                res.status(200).send({
                    token: token
                })
            }
        }
    )

    router.get('/steam',
        (req, res, next) => {
            res.cookie('redirect', req.query.redirect)
            next()
        },
        passport.authenticate('steam', { session: false }),
        (req, res) => {});

    router.get('/steam/return',
        passport.authenticate('steam', { failureRedirect: '/login',  session: false  }),
        async (req, res) => {
            let redirect = req.cookies.redirect
            if (redirect !== "undefined") {
                res.redirect(redirect + "?token=" + await tokenForAuthenticator(req.user, 'steam'))
            } else {
                let token = await tokenForAuthenticator(req.user, 'steam')
                res.status(200).send({
                    token: token
                })
            }
        })

    router.post('/mail',
        passport.authenticate('mailgun', { session: false })
    )

    router.get('/mail/callback',
        passport.authenticate('mailgun', { session: false }),
        async (req, res) => {
            let redirect = req.cookies.redirect
            res.redirect(redirect + "?token=" + await tokenForAuthenticator(req.user, 'mailgun'))
        })

    router.get('/discord',
        (req, res, next) => {
            res.cookie('redirect', req.query.redirect)
            next()
        },
        passport.authenticate('discord', { session: false }))

    router.get('/discord/callback', passport.authenticate('discord', {
        failureRedirect: '/',
        session: false
    }),  async (req, res) => {
        let redirect = req.cookies.redirect
        if (redirect !== "undefined") {
            res.redirect(redirect + "?token=" + await tokenForAuthenticator(req.user, 'discord'))
        } else {
            let token = await tokenForAuthenticator(req.user, 'discord')
            res.status(200).send({
                token: token
            })
        }
    })

    return router
}

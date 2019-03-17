import passport from 'passport-strategy'
import util from 'util'
import mailgunModule from './mailgun'
import fs from 'fs'
let loginTemplate = fs.readFileSync('./passport/emailLogin.html', 'utf8')
import jwt from 'jsonwebtoken'
import gravatar from 'gravatar'

let makeLoginHtml = (link) => {
    return loginTemplate.replace(/REPLACELINK/g, link)
}

function Strategy(options) {
    this.name = 'mailgun'
    this.mailgun = mailgunModule(options.apiKey, options.domain, options.sender)
    this.requestSentUrl = options.requestSentUrl
    this.authUrl = options.authUrl
    this.jwtSecret = options.jwtSecret
    passport.Strategy.call(this)
}

util.inherits(Strategy, passport.Strategy)

Strategy.prototype.authenticate = function(req, options) {
    if (req.route.path.includes('callback')) {
        let token = req.query.token
        jwt.verify(token, this.jwtSecret)
        let parsedToken = jwt.decode(token, this.jwtSecret)
        let parsedTokenMail = parsedToken.data.mail
        let avatar = gravatar.url(parsedTokenMail, {
            protocol: 'https',
            s: '512',
            r: 'pg',
        })

        this.success({
            id: parsedTokenMail,
            avatar: avatar,
            type: 'mailgun'
        })
    } else {
        let mail = req.body.mail
        let signInToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 10) * 1000,
            data: {
                mail: mail
            }
        }, this.jwtSecret)
        this.mailgun.send(mail, 'Login', makeLoginHtml(this.authUrl + '?token=' + signInToken))
        this.redirect(this.requestSentUrl)
    }
}

export default Strategy

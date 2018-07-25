let mailgun = require('../../mails/mailgun.js')
let loginTemplate = require('fs').readFileSync('mails/emailLogin.html', 'utf8')
let makeLoginHtml = async (link) => {
    return loginTemplate.replace(/REPLACELINK/g, link)
}

module.exports = class MailAuthenticator {

    constructor(config, jwtHandler) {
        this.mailgun = mailgun(config.mailgunApiKey, config.mailgunDomain, config.mailgunSender)
        this.jwtHandler = jwtHandler
        this.authUrl = config.authUrl + 'mail/callback/'
    }

    async requestAuthentication (requestData) {
        let mail = requestData.mail
        let redirect = requestData.redirect

        let jwtToken = this.jwtHandler.generateToken({
            mail: mail,
            redirect: redirect
        })
        let loginLink = this.authUrl + '?token=' + jwtToken
        console.log('email link: ' + loginLink)
        //this.mailgun.send(mail, 'Login', await makeLoginHtml(loginLink))
    }

    async verifyAuthentication (requestData) {
        if (jwtHandler.validateToken(requestData)) {
            let data = jwtHandler.parseAuthToken(requestData)
            return {
                id: data.mail,
                redirect: data.redirect
            }
        }
    }

}
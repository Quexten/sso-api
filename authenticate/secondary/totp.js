const { promisify } = require('es6-promisify')
const tfa = require('2fa');
let generateKey = promisify(tfa.generateKey)
let generateQr = promisify(tfa.generateGoogleQR)

let SecondaryAuthenticator = require('./secondaryAuthenticator')

class TotpAuthenticator extends SecondaryAuthenticator {

    constructor () {
        super()
    }

    async create () {
        let key = await generateKey(100)
        let qr = await generateQr('Quexten-SSO', 'Quexten-SSO', key)

        return {
            id: 'totp',
            data: {
                qr: qr,
                key: key
            }
        }
    }

    async verify (data, claim) {
        let opts = {
            beforeDrift: 2,
            afterDrift: 2,
            step: 30
        }

        let isTokenValid = tfa.verifyTOTP(req.query.key, req.query.code, opts)
        if(isTokenValid)
            user.auth.secondary.push({
                id: 'totp',
                key: req.query.key
            })

        return user
    }

    async onAuthenticate (requestData, databaseData) {
        return databaseData
    }
}

module.exports = {
    TotpAuthenticator: TotpAuthenticator
}


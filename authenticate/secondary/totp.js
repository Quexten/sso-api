const { promisify } = require('es6-promisify')
const tfa = require('2fa');
let generateKey = promisify(tfa.generateKey)
let generateQr = promisify(tfa.generateGoogleQR)

module.exports = {
    create: async () => {
        let key = await generateKey(100)
        let qr = await generateQr('Quexten', 'Quexten\nQuexten', key)

        return {
            qr: qr,
            key: key
        }
    },

    verify: async (req, res) => {
        let user = req.user

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

        res.send(isTokenValid)

        return user
    },

    authenticate: (req, authData) => {
        var opts = {
            beforeDrift: 2,
            afterDrift: 2,
            step: 30
        }

        let isTokenValid = tfa.verifyTOTP(authData.key, req.query.code, opts)

        return isTokenValid
    }
}


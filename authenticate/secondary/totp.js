
var tfa = require('2fa');

module.exports = {

    create: (req, res, callback) => {
        let user = req.user
        tfa.generateKey(100, function(err, key) {
            tfa.generateGoogleQR('Quexten', 'Quexten\nQuexten', key, function(err, qr) {
                res.send({
                    qr: qr,
                    key: key
                })
                callback(user)
            });
        });
    },

    verify: (req, res, callback) => {
        let user = req.user
        var opts = {
            beforeDrift: 2,
            afterDrift: 2,
            step: 30
        }

        let isTokenValid = tfa.verifyTOTP(req.query.key, req.query.code, opts)

        res.send(isTokenValid)

        if(isTokenValid)
        user.auth.secondary.push({
            id: 'totp',
            key: req.query.key
        })
        callback(user)
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


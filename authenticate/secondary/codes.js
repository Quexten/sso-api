var tfa = require('2fa');

module.exports = {

    create: (req, res, callback) => {
        let user = req.user
        tfa.generateBackupCodes(8, 'xxxx-xxxx-xxxx', function(err, codes) {
            res.send({
                codes: codes
            })
            user.auth.secondary.push({
                id: 'backup-codes',
                codes: codes
            })
            callback(user)
        })
    },

    authenticate: (req, authData) => {
        let code = req.query.code
        return authData.codes.indexOf(code) > -1
    }
}
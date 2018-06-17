var tfa = require('2fa');

module.exports = {

    create: (req, res) => {
        tfa.generateBackupCodes(8, 'xxxx-xxxx-xxxx', function(err, codes) {

        })
    },

    authenticate: (req, res, user) => {
        let code = req.query.code
        return user.codes.indexOf(code) > -1
    }
}
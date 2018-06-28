let tfa = require('2fa');
let { promisify } = require('es6-promisify')

let generateBackupCodes = promisify(tfa.generateBackupCodes)

module.exports = {
    create: async () => {
        let codes = await generateBackupCodes(8, 'xxxx-xxxx-xxxx')
        return {
            id: 'backup-codes',
            codes: codes
        }
    },

    authenticate: (req, authData) => {
        let code = req.query.code
        return authData.codes.indexOf(code) > -1
    }
}
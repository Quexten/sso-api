let tfa = require('2fa');
let { promisify } = require('es6-promisify')
let generateBackupCodes = promisify(tfa.generateBackupCodes)
let SecondaryAuthenticator = require('./secondaryAuthenticator')

class CodesAuthenticator extends SecondaryAuthenticator {

    constructor () {
        super()
    }

    async create () {
        let codes = await generateBackupCodes(8, 'xxxx-xxxx-xxxx')
        return {
            id: 'backup-codes',
            data: {
                codes: codes
            }
        }
    }

    async verify (requestData, databaseData) {
        let code = requestData.code
        return databaseData.codes.indexOf(code) > -1
    }

    async onAuthenticate (requestData, databaseData) {
        let code = requestData.code
        databaseData.codes = databaseData.codes.filter((entry) => { return entry !== code })
        return databaseData
    }

}

module.exports = {
    CodesAuthenticator: CodesAuthenticator
}

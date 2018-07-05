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
            codes: codes
        }
    }

    async verify () {

    }

    async authenticate (requestData, databaseData) {
        let code = requestData.code
        return databaseData.codes.indexOf(code) > -1
    }

}

module.exports = {
    CodesAuthenticator: CodesAuthenticator
}

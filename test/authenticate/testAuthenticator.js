let PrimaryAuthenticator = require('../../authenticate/primary/primaryAuthenticator')

class TestAuthenticator extends PrimaryAuthenticator {

    constructor () {
        super()
    }

    async requestAuthentication (requestData) {
    }

    async verifyAuthentication (requestData, databaseData) {
    }

}

module.exports = {
    TestAuthenticator: TestAuthenticator
}

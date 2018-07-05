let assert = require('assert')

let { TotpAuthenticator } = require("../authenticate/secondary/totp")

describe('Totp authenticator Test', () => {

    let authenticator = new TotpAuthenticator()

    it('Create Totp', (done) => {
        authenticator
            .create()
            .then((result) => {
                assert.equal(result.id, 'totp')
                assert.notEqual(result.data.key, null)
                assert.notEqual(result.data.qr, null)
            })
            .then(done)
    })

})
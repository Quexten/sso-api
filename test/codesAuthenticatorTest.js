let assert = require('assert')

let { CodesAuthenticator } = require("../authenticate/secondary/codes")

describe('Codes authenticator Test', () => {
    let authenticator = new CodesAuthenticator()

    it('Create Codes', (done) => {
        authenticator
            .create()
            .then((result) => {
                assert.equal(result.id, 'backup-codes')
                assert.equal(result.data.codes.length, 8)
            })
            .then(done)
    })

    it('Verify Correct Codes', (done) => {
        let mockRequestData = {
            code: 'AAAA-AAAA-AAAA'
        }
        let mockDatabaseData = {
            codes: ['AAAA-AAAA-AAAA']
        }

        authenticator
            .verify(mockRequestData, mockDatabaseData)
            .then((result) => {
                assert.equal(result, true)
            })
            .then(done)
    })

    it('Reject Incorrect Codes', (done) => {
        let mockRequestData = {
            code: 'BBBB-BBBB-BBBB'
        }
        let mockDatabaseData = {
            codes: ['AAAA-AAAA-AAAA']
        }

        authenticator
            .verify(mockRequestData, mockDatabaseData)
            .then((result) => {
                assert.equal(result, false)
            })
            .then(done)
    })

    it('Remove Otp On Verification', (done) => {
        let authenticationData = {
            code: 'AAAAA-AAAAA-AAAAA'
        }
        let databaseData = {
            codes: ['AAAAA-AAAAA-AAAAA']
        }
        authenticator
            .onAuthenticate(authenticationData, databaseData)
            .then((result) => {
                assert.equal(result.codes.length, 0)
            })
            .then(done)
    })

})
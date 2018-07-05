let assert = require('assert')

let { CodesAuthenticator } = require("../authenticate/secondary/codes")

describe('Codes authenticator Test', () => {
    let authenticator = new CodesAuthenticator()

    it('Create Codes', (done) => {
        authenticator
            .create()
            .then((data) => {
                assert.equal(data.id, 'backup-codes')
                assert.equal(data.codes.length, 8)
            })
            .then(done)
    })

    it('Accept Correct Authentication Data', (done) => {
        let authenticationData = {
            code: 'AAAAA-AAAAA-AAAAA'
        }
        let databaseData = {
            codes: ['AAAAA-AAAAA-AAAAA']
        }
        authenticator
            .authenticate(authenticationData, databaseData)
            .then((result) => {
                assert.equal(result, true)
            })
            .then(done)
    })

    it('Reject Incorrect Authentication Data', (done) => {
        let authenticationData = {
            code: 'BBBBB-BBBBB-BBBBB'
        }
        let databaseData = {
            codes: ['AAAAA-AAAAA-AAAAA']
        }
        authenticator
            .authenticate(authenticationData, databaseData)
            .then((result) => {
                assert.equal(result, false)
            })
            .then(done)
    })


})
let assert = require('assert')
let primaryAuthenticator = require('../authenticate/primary/authenticator')
let { TestAuthenticator } = require('./authenticate/testAuthenticator')


let createEmptyAuthenticator = async () => {
    return primaryAuthenticator(require('./db/mockdb'))
}

let createTestAuthenticator = async () => {
    let authenticator = await createEmptyAuthenticator()
    authenticator.registerAuthenticator('test', new TestAuthenticator())
    return authenticator
}

describe('Primary Authenticator Test', () => {
    it('Create Empty Authenticator', (done) => {
        createEmptyAuthenticator()
            .then(() => {
                done()
            })
    })

    it('Create Test Authenticator', (done) => {
        createTestAuthenticator()
            .then(() => {
                done()
            })
    })

    it('Is Authenticator Registered', (done) => {
        createTestAuthenticator()
            .then((authenticator) => {
                return authenticator.isAuthenticatorRegistered('test')
            })
            .then((isRegistered) => {
                assert.equal(isRegistered, true)
            })
            .then(() => {
                done()
            })
    })


    it('Create User', (done) => {
        createTestAuthenticator()
            .then((authenticator) => {
                authenticator.createUser()
            })
            .then(() => {
                done()
            })
    })

    it('Request Authentication - Accept Correct Authenticator', (done) => {
        createTestAuthenticator()
            .then((authenticator) => {
                return authenticator.requestAuthentication('test', {})
            })
            .then(() => {
                done()
            })
    })

    it('Request Authentication - Reject Incorrect Authenticator', (done) => {
        createTestAuthenticator()
            .then((authenticator) => {
                authenticator.requestAuthentication('test_incorrect', {})
                    .catch(() => {
                        done()
                    })
            })
    })

    it('Verify Authentication - Accept Correct Authenticator', (done) => {
        createTestAuthenticator()
            .then((authenticator) => {
                authenticator.verifyAuthentication('test', {})
            })
            .then(done)
    })


    it('Verify Authentication - Reject Incorrect Authenticator', (done) => {
        createTestAuthenticator()
            .then((authenticator) => {
                authenticator.verifyAuthentication('test_incorrect', {})
                    .catch(() => {
                        done()
                    })
            })
    })

    it('Remove User', (done) => {
        createTestAuthenticator()
            .then((authenticator) => {
                authenticator.createUser()
                    .then((user) => {
                        authenticator.removeUser(user._id)
                    })
                    .then(done)
            })
    })

})
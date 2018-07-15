let assert = require('assert')

describe('User CRUD Test', () => {
    it('Create user', (done) => {
        let mockdb = require('./db/mockdb') ()
        let mockUser = { 'test': 'mock' }

        mockdb
            .createUser(mockUser)
            .then(id => mockdb.findUser(id))
            .then((user) => {
                assert.equal(user, mockUser)
            })
            .then(() => {
                done()
            })
    })

    it('Find user', (done) => {
        let mockdb = require('./db/mockdb')()
        let mockUser = { 'test': 'mock' }

        mockdb
            .createUser(mockUser)
            .then(id => mockdb.findUser(id))
            .then((user) => {
                assert.equal(user, mockUser)
            })
            .then(() => {
                done()
            })
    })

    it('Update user', (done) => {
        let mockdb = require('./db/mockdb')()
        let mockUser = { 'test': 'mock' }

        mockdb
            .createUser(mockUser)
            .then(id => {
                mockdb.updateUser(id, {
                    'test': 'mockUpdate'
                })
                return id
            })
            .then(id => mockdb.findUser(id))
            .then((user) => {
                mockUser['test'] = 'mockUpdate'
                assert.deepEqual(user, mockUser)
            })
            .then(() => {
                done()
            })
    })

    it('Not find nonexsistent user', (done) => {
        let mockdb = require('./db/mockdb')()
        let mockUser = { 'test': 'mock' }

        mockdb
            .createUser(mockUser)
            .then(id => mockdb.findUser(id + 1))
            .then((user) => {
                mockUser['test'] = 'mockUpdate'
                assert.equal(user, null)
            })
            .then(() => {
                done()
            })
    })

    it('Delete user', (done) => {
        let mockdb = require('./db/mockdb')()
        let mockUser = { 'test': 'mock' }

        mockdb
            .createUser(mockUser)
            .then(id => {
                mockdb.deleteUser(id)
                return id
            })
            .then(id => mockdb.findUser(id))
            .then((user) => {
                assert.equal(user, null)
            })
            .then(() => {
                done()
            })
    })
})
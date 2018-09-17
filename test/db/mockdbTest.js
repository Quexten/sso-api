import assert from 'assert'
import MockDatabase from '../../db/mockDatabase'

describe('MockDB', () => {
    let database;
    let user;

    before(async () => {
        database = new MockDatabase()
        user = {
            profile: {
                username: 'Username',
                avatar: 'http://localhost/avatar.png'
            }
        }
    })

    afterEach(async () => {
        await database.deleteUsers()
        user = {
            profile: {
                username: 'Username',
                avatar: 'http://localhost/avatar.png'
            }
        }
    })

    it('Create & Find User', async () => {
        let id = await database.createUser(user)
        let dbUser = await database.findUser(id)
        user._id = id
        await assert.deepEqual(dbUser, user)
    })

    it('Update User', async () => {
        let id = await database.createUser(user)
        user.profile.username = 'UpdatedUsername'
        await database.updateUser(id, user)
        let dbUser = await database.findUser(id)
        assert.deepEqual(dbUser, user)
    })

    it('Reject non-existent User', async () => {
        await database.createUser(user)
        let dbUser = await database.findUser(-1)
        assert.equal(dbUser, null)
    })

    it('Delete User', async () => {
        let id = await database.createUser(user)
        await database.deleteUser(id)
        let dbUser = await database.findUser(id)
        assert.equal(dbUser, null)
    })
})
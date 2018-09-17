import assert from 'assert'
import MockDatabase from '../../db/mockDatabase'
import UserApi from '../../users/userApi'

describe('User Api', () => {
    let database;
    let userApi;

    before(async () => {
        database = new MockDatabase()
        userApi = new UserApi(database)
    })

    afterEach(async () => {
        await database.deleteUsers()
    })

    it('Create User', async () => {
        let user = await userApi.createUser()
        await assert.deepEqual(await database.findUser(user._id), user)
    })

    it('Delete User', async () => {
        let user = userApi.createUser()
        await userApi.deleteUser(user._id)
        await assert.deepEqual(await database.findUser(user._id), null)
    })

})
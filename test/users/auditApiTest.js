import assert from 'assert'
import MockDatabase from '../../db/mockDatabase'
import AuditApi from '../../users/auditApi'

describe('Audit Api', () => {
    let database;
    let auditApi;

    before(async () => {
        database = new MockDatabase()
        auditApi = new AuditApi(database)
    })

    afterEach(async () => {
        await database.deleteUsers()
    })

    it('List Events', async () => {
        let event = {
            'test': 'test'
        }
        let user = {
            audit: {
                events: [event]
            }
        }
        let id = await database.createUser(user)
        let events = await auditApi.listEvents(id)
        await assert.deepEqual(user.audit.events, events)
    })

    it('Push Event', async () => {
        let user = {
            audit: {
                events: []
            }
        }
        let id = await database.createUser(user)

        let eventId = await auditApi.pushEvent(id, {}, 'testType', 'localhost', 'testUserAgent')
        let events = await auditApi.listEvents(id)
        let event = events.find((event) => event._id === eventId)
        assert.equal(event.type, 'testType')
        assert.equal(event.origin, 'localhost')
        assert.equal(event.userAgent, 'testUserAgent')
    })


})
export default class AuditApi {

    constructor (database) {
        this.database = database
    }

    async listEvents (userId) {
        let user = await this.database.findUser(userId)
        return user.audit.events
    }

    async pushEvent (userId, data, eventType, origin, userAgent) {
        let event = {
            _id: await this.database.getUniqueId(),
            time: new Date(Date.now()),
            origin: origin,
            type: eventType,
            data: data,
            userAgent: userAgent
        }

        let user = await this.database.findUser(userId)
        user.audit.events.push(event)
        await this.database.updateUser(userId, user)

        return event._id
    }

}
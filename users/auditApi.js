module.exports = async (database) => {

    let listEvents = async (userId) => {
        let user = await database.findUser(userId)
        return user.audit
    }

    let pushEvent = async (userId, data, eventType, origin, userAgent) => {
        let event = {
            id: await database.getUniqueId(),
            time: new Date(Date.now()),
            origin: origin,
            type: eventType,
            data: data,
            userAgent: userAgent
        }

        let user = await database.findUser(userId)
        user.audit.events.push(event)
        await database.updateUser(userId, user)

        return user
    }

    return {
        pushEvent: pushEvent,
        listEvents: listEvents
    }
}

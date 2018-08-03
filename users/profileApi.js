module.exports = async (database) => {

    let get = async (id) => {
        let user = await database.findUser(id)
        return user.profile
    }

    let update = async (id, profile) => {
        let user = await database.findUser(id)
        user.profile = profile
        await database.updateUser(id, user)
        return user
    }

    return {
        get: get,
        update: update
    }
}

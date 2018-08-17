module.exports = async (database, avatarApi) => {

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

    let updateUsername = async (id, username) => {
        let profile = await get(id)
        profile.username = username
        await update(id, profile)
        return profile
    }

    let updateAvatar = async (id, url) => {
        let avatarUrl = await avatarApi.uploadUserImage(id, url)
        let profile = await get(id)
        profile.avatar = avatarUrl
        await update(id, profile)
        return profile
    }

    return {
        get: get,
        update: update,
        updateUsername: updateUsername,
        updateAvatar
    }
}

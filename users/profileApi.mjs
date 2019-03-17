export default class ProfileApi {

    constructor (database, avatarApi) {
        this.database = database
        this.avatarApi = avatarApi
    }

    async get (id) {
        let user = await this.database.findUser(id)
        return user.profile
    }

    async update (id, profile) {
        let user = await this.database.findUser(id)
        user.profile = profile
        await this.database.updateUser(id,  user)
        return user
    }

    async updateUsername (id, username) {
        let profile = await this.get(id)
        profile.username = username
        await this.update(id, profile)
        return profile
    }

    async updateAvatar (id, url) {
        let avatarUrl = await this.avatarApi.uploadUserImage(id, url)
        let profile = await this.get(id)
        profile.avatar = avatarUrl
        await this.update(id, profile)
        return profile
    }

}

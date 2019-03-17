export default class UserApi {

    constructor (database) {
        this.database = database
    }

    async createUser () {
        let user = {
            authentication: {
                primary: [],
                secondary: [],
                sessions: []
            },
            audit: {
                events: [
                ]
            },
            profile: {
                avatar: '',
                username: ''
            }
        }
        let id = await this.database.createUser(user)
        user._id = id
        return user
    }

    async deleteUser (userId) {
        await this.database.deleteUser(userId)
    }

    async getUser (userId) {
        return await this.database.findUser(userId)
    }

    async getUsers () {
        return await this.database.getUsers()
    }

}
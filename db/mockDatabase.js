import Database from './database'

export default class MockDatabase extends Database {

    constructor () {
        super()
        this.users = {}
        this.id = 0
    }

    async getUniqueId() {
        return this.id++
    }

    async createUser(user) {
        user = JSON.parse(JSON.stringify(user))
        let id = await this.getUniqueId()
        user._id = id
        this.users[id] = user
        return id
    }

    async findUser(id) {
        return this.users[id]
    }

    async updateUser(id, user) {
        user = JSON.parse(JSON.stringify(user))
        this.users[id] = user
    }

    async deleteUser(id) {
        delete this.users[id]
    }

    async findUserByPrimaryAuthenticatorId (authType, id) {
        for (let userId in this.users) {
            let user = this.users[userId]

            if (user == null)
                continue

            let authenticators = user.authentication.primary
            let matchingTypeAuthenticators = authenticators.filter(authenticator => authenticator.type === authType)
            let matchingAuthenticators = matchingTypeAuthenticators.filter(authenticator => authenticator.id === id)
            if (matchingAuthenticators.length > 0)
                return user
        }
        return null
    }

    async getUsers (startIndex, endIndex) {
    }

    async deleteUsers () {
        this.users = {}
    }

}
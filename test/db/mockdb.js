let users = {}

let id = 0

module.exports = {
    createUser: async function (user) {
        let id = user._id
        users[id] = user
        return id
    },
    findUser: async function (id) {
        return users[id]
    },
    updateUser: function(id, user) {
        users[id] = user
    },
    deleteUser: function (id) {
        users[id] = null
    },

    findUserByPrimaryAuthenticatorId: async (authType, id) => {
        for (let userId in users) {
            let user = users[userId]

            if (user == null)
                continue

            let authenticators = user.authentication.primary
            let matchingTypeAuthenticators = authenticators.filter(authenticator => authenticator.type === authType)
            let matchingAuthenticators = matchingTypeAuthenticators.filter(authenticator => authenticator.id === id)
            if (matchingTypeAuthenticators.size > 0)
                return user
        }
        return null
    },
    findUserBySecondaryAuthenticatorId: async (authType, id) => {
        for (let user in users) {
            let authenticators = user.auth.primary
            let matchingTypeAuthenticators = authenticators.filter(authenticator => authenticator.type === authType)
            let matchingAuthenticators = matchingTypeAuthenticators.filter(authenticator => authenticator.id === id)
            if (matchingTypeAuthenticators.size > 0)
                return user
        }
        return null
    },
    getUniqueId: async () => {
        return id++
    }
}
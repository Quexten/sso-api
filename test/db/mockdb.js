let users = []

module.exports = {
    createUser: async function (user) {
        users[users.length] = user
        return users.length - 1
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
        for (let user in users) {
            let authenticators = user.auth.primary
            let matchingTypeAuthenticators = authenticators.filter(authenticator => authenticator.type === authType)
            let matchingAuthenticators = matchingTypeAuthenticators.filter(authenticator => authenticator.id === id)
            if (matchingTypeAuthenticators.size > 0)
                return user
        }
        return null
    },

    finduserBySecondaryAuthenticatorId: async (authType, id) => {
        for (let user in users) {
            let authenticators = user.auth.primary
            let matchingTypeAuthenticators = authenticators.filter(authenticator => authenticator.type === authType)
            let matchingAuthenticators = matchingTypeAuthenticators.filter(authenticator => authenticator.id === id)
            if (matchingTypeAuthenticators.size > 0)
                return user
        }
        return null
    }
}
module.exports = function (auditApi) {
    let users = {}
    let id = 0

    let createUser = async function (user) {
        let id = user._id
        users[id] = user
        return id
    }

    let findUser = async function (id) {
        return users[id]
    }

    let updateUser = function(id, user) {
        users[id] = user
    }

    let deleteUser = function (id) {
        delete users[id]
    }

    let findUserByPrimaryAuthenticatorId = async (authType, id) => {
        for (let userId in users) {
            let user = users[userId]

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

    let findUserBySecondaryAuthenticatorId = async (authType, id) => {
        for (let user in users) {
            let authenticators = user.auth.primary
            let matchingTypeAuthenticators = authenticators.filter(authenticator => authenticator.type === authType)
            let matchingAuthenticators = matchingTypeAuthenticators.filter(authenticator => authenticator.id === id)
            if (matchingTypeAuthenticators.size > 0)
                return user
        }
        return null
    }

    let getUsers = async () => {
        let userArray = []
        for (let userId in users) {
            userArray.push(users[userId])
        }
        return userArray
    }

    let getUniqueId = async () => {
        return id++
    }

    return {
        createUser: createUser,
        findUser: findUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByPrimaryAuthenticatorId: findUserByPrimaryAuthenticatorId,
        findUserBySecondaryAuthenticatorId: findUserBySecondaryAuthenticatorId,
        getUniqueId: getUniqueId,
        getUsers: getUsers
    }
}

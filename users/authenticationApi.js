module.exports = async (database) => {

    let addPrimaryAuthenticator = async (userId, authenticator) => {
        let user = await database.findUser(userId)
        user.authentication.primary.push(authenticator)
        database.updateUser(userId, user)
    }

    let removePrimaryAuthenticator = async (userId, authenticator) => {
        let user = await database.findUser(userId)
        user.authentication.primary.filter((value) => { return value !== authenticator})
        database.updateUser(userId, user)
    }

    let findUserByAuthenticator = async (authenticatorId, authenticatorType) => {
        let user = await database.findUserByPrimaryAuthenticatorId(authenticatorType, authenticatorId)
        return user
    }

    return {
        addPrimaryAuthenticator,
        removePrimaryAuthenticator
    }

}

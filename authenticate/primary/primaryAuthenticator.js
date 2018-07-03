module.exports = function(database) {

    let authenticators = {}

    let registerAuthenticator = async (authenticatorType, authenticator) => {
        authenticators[authenticatorType] = authenticator
    }

    let isAuthenticatorRegistered = async (authenticatorType) => {
        return authenticators.indexOf(authenticatorType) === -1
    }


    //If user exists, returns true if credentials are valid,
    //If user doesn't exist, returns null
    let authenticateUser = async (authenticatorType, authenticationData) => {
        if (isAuthenticatorRegistered(authenticatorType)) {
            throw new Error('Authenticator type' + authenticatorType + 'not available.')
        }

        let user = await database.getUserByAuthenticatorId(authenticatorType, authenticatorId)

        if (user === null) {
            return false
        }

        return authenticators[authenticatorType].authenticateUser(authenticationData)
    }

    let registerUser = async (authenticatorType, authenticationData) => {
        if (isAuthenticatorRegistered(authenticatorType)) {
            throw new Error('Authenticator type' + authenticatorType + 'not available.')
        }

        let user = await database.getUserByAuthenticatorId(authenticatorType, authenticatorId)

        if (user === null) {
            return false
        }
    }

    let removeUser = async () => {

    }

    let addUserAuthenticator = async (authenticatorType, authenticator) => {

    }

    let removeUserAuthenticator = async (authenticatorType) => {

    }

    return {
        registerAuthenticator: registerAuthenticator,
        authenticateUser: authenticateUser
    }


}
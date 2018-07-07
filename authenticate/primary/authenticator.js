module.exports = function(database) {

    let authenticators = {}

    //Authenticatiors registration
    let registerAuthenticator = async (authenticatorType, authenticator) => {
        authenticators[authenticatorType] = authenticator
    }

    let isAuthenticatorRegistered = async (authenticatorType) => {
        return authenticators[authenticatorType] != null
    }

    let createUser = async () => {
        let user = {
            _id: await database.getUniqueId(),
            authentication: {
                primary: [],
                secondary: []
            },
            audit: {
                events: [
                ],
                enabled: false
            },
            profile: {
                avatar: '',
                username: ''
            }
        }
        await database.createUser(user)
        return user
    }


    //Authentication
    let requestAuthentication = async (authenticatorType, authenticationData) => {
        if (!await isAuthenticatorRegistered(authenticatorType)) {
            throw new Error('Authenticator type ' + authenticatorType + ' not available.')
        }

        return authenticators[authenticatorType].requestAuthentication(authenticationData)
    }

    let verifyAuthentication = async (authenticatorType, authenticationId, authenticationData) => {
        if (!await isAuthenticatorRegistered(authenticatorType)) {
            throw new Error('Authenticator type ' + authenticatorType + ' not available.')
        }

        let user = await database.findUserByPrimaryAuthenticatorId(authenticatorType, authenticationId)

        if (user === null) {
            user = await createUser()
            return
        } else {
            let authenticated = false
            let verificationPromises = []

            for (let id in user.authentication.primary) {
                let authenticator = user.authentication.primary[id]
                verificationPromises.push(
                    authenticators[authenticatorType]
                        .verifyAuthentication(authenticationData, authenticator)
                        .then((result) => {
                            if (result)
                                authenticated = true
                        })
                )
            }

            await Promise.all(verificationPromises)

            if (!authenticated)
                throw new Error('Could not authenticate')
        }
    }

    let removeUser = async (id) => {
        await database.deleteUser(id)
    }


    let addPrimaryAuthenticatorToUser = async (authenticatorType, authenticatorData, id) => {
        let user = await database.findUser(id)
        let authenticators = user.auth.primary

        authenticators.push({
            type: authenticatorType,
            data: authenticatorData
        })

        user.auth.primary = authenticator
        database.updateUser(id, user)
    }

    let getPrimaryAuthenticatorsForUser = async (id) => {
        return user.authenticators.primary
    }

    let removePrimaryAuthenticatorFromUser = async (authenticatorId, id) => {
        let user = await database.findUser(id)
        let authenticators = user.auth.primary

        authenticators = user.auth.primary.filter((authenticator) => { return authenticator.id !== id })
        user.auth.primary = authenticators

        database.updateUser(id, authenticatorId)
    }


    return {
        registerAuthenticator: registerAuthenticator,
        isAuthenticatorRegistered: isAuthenticatorRegistered,
        createUser: createUser,
        requestAuthentication: requestAuthentication,
        verifyAuthentication: verifyAuthentication,
        removeUser: removeUser,
        addPrimaryAuthenticatorToUser: addPrimaryAuthenticatorToUser,
        getPrimaryAuthenticatorsForUser: getPrimaryAuthenticatorsForUser,
        removePrimaryAuthenticatorFromUser: removePrimaryAuthenticatorFromUser
    }

}
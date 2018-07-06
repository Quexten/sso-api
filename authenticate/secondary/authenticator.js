module.exports = (database) => {

    let { CodesAuthenticator } = require('./codes')
    let { TotpAuthenticator } = require('./totp')

    let authenticators = []
    authenticators['codes'] = new CodesAuthenticator()
    authenticators['totp'] = new TotpAuthenticator()

    let create = async (authenticatorType) => {
        if (authenticators[authenticatorType] === null)
            throw new Error('No such authenticator found')
        else {
            return authenticators[authenticatorType].create()
        }
    }

    let verify = async (userId, authenticatorType, data) => {
        if (authenticators[authenticatorType] === null)
            throw new Error('No such authenticator found')
        else {
            let user = await database.findUserById(userId)

            try {
                let data = authenticators[authenticatorType].verify(data)

                user.auth.secondary.push({
                    authenticatorId: authenticatorType,
                    data: data,
                    _id: await database.
                })
            } catch (err) {
                console.log(err)
            }

            database.updateUser(user._id, user)
            return false
        }
    }

    return {
        create: create,
        verify: verify
    }
}
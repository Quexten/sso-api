module.exports = (database) => {
    let {ObjectID} = require('mongodb')

    let { CodesAuthenticator } = require('./codes')
    let { TotpAuthenticator } = require('./totp')

    let authenticators = []
    authenticators['codes'] = new CodesAuthenticator()
    authenticators['totp'] = new TotpAuthenticator()

    let create = async (authenticatorType) => {
        if (authenticators[authenticatorType] === null)
            reject('No such authenticator found')
        else {
            return authenticators[authenticatorType].create()
        }
    }

    let verify = async (userId, authenticatorType, data) => {
        if (authenticators[authenticatorType] === null)
            reject('No such authenticator found')
        else {
            let user = await database.findUserById(userId)

            try {
                let data = authenticators[authenticatorType].verify(data)

                user.auth.secondary.push({
                    authenticatorId: authenticatorType,
                    data: data,
                    _id: new ObjectId()
                })
            } catch (err) {
                console.log(err)
            }

            database.updateUser(user._id, user)
            return false
        }
    }

    let authenticate = async (userId, authenticatorType, data) => {
        if (authenticators[authenticatorType] === null) {
            reject('No such authenticator found')
        } else {
            let user = await database.findUserById(userId)

            user.auth.secondary.forEach((userAuthData) => {
                if (userAuthData.id == authenticatorType) {
                    if (authenticators[authenticatorType].authenticate(data, userAuthData.data))
                        return true
                }
            })
            return false
        }
    }

    return {
        create: create,
        verify: verify,
        authenticate: authenticate
    }
}
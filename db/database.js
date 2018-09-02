module.exports = async (url) => {
    let { MongoClient, ObjectId } = require('mongodb')

    let mongo = await MongoClient.connect(url)
    let database = mongo.db('sso-api')
    let users = database.collection('users')

    let createUser = (user) => users.insertOne(user)

    let findUser = (id) => users.findOne({ _id: ObjectId(id) })

    let updateUser = (id, user) => users.updateOne({ _id: ObjectId(id)}, { $set: user })

    let deleteUser = (id) => users.removeOne({ _id: ObjectId(id) })

    let findUserByPrimaryAuthenticatorId = async (authType, id) => {
        return users.findOne({
            'authentication.primary.id': id,
            'authentication.primary.type': authType
        })
    }

    let findUserBySecondaryAuthenticatorId = async (authType, id) => {
        throw new Error('Finding users by the secondary authenticator is not implemented for mongodb driver')
    }

    let getUsers = async () => {
        throw new Error('Getting all users is not implemented for mongodb driver')
    }

    let getUniqueId = async () => {
        return new ObjectId(Date.now())
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

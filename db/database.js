module.exports = (url) => {
    let { MongoClient, ObjectId } = require('mongodb')
    let users = {}

    MongoClient.connect(url, function(err, db) {
        if (err)
            throw err
        let dbo = db.db("sso")
        users = dbo.collection("users")
    })


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














    async function findUserById () {

    }
    findUserById: async function (id) {
        return await users.findOne({
            _id: ObjectId(id)
        })
    },
    findUserByAuthenticator: async function(authType, id) {
        return await users.findOne({
            'auth.primary.type': authType,
            'auth.primary.authenticatorId': id
        })
    },
    updateUser: function(id, values) {
        users.update({_id: ObjectId(id)}, values)
    }
}

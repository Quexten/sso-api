module.exports = (url) => {
    let { MongoClient, ObjectId } = require('mongodb')
    let users = ''

    MongoClient.connect(url, function(err, db) {
        if (err)
            throw err
        let dbo = db.db("sso")
        users = dbo.collection("users")
    })

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
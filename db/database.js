const { MongoClient, ObjectId } = require('mongodb')
var url = "mongodb://localhost:27017/"
var users = ''

MongoClient.connect(url, function(err, db) {
    if (err) throw err
    var dbo = db.db("sso")
    users = dbo.collection("users")
})

module.exports = {
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
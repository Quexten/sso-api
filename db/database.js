const { MongoClient, ObjectId } = require('mongodb');
var url = "mongodb://localhost:27017/";
var users = ''

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sso");
    users = dbo.collection("users")
    dbo.collection("users")
});

module.exports = {
    findUserById: function (id, callback) {
        users.findOne({
            _id: ObjectId(id)
        }, callback);
    },
    findUserByAuthenticator: function(authType, id, callback) {
        let query = {
            'auth.primary.type': authType,
            'auth.primary.id': id
        }
        users.findOne(query, callback)
    },
    updateUser: function(id, values) {
        users.update({_id: ObjectId(id)}, values)
    }
}
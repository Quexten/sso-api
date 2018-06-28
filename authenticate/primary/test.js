module.exports = {

    signIn: function (req, database, callback) {
        database.findUserByAuthenticator('test', req.query.id, (error, user) => {
            callback(user)
        })
    }

}
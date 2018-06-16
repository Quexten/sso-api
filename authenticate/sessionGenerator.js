const TokenGenerator = require('uuid-token-generator');

function generateToken () {
    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62)
    return tokgen.generate()
}

module.exports = function (database) {
    return {
        createSession: function (id, req, res, callback) {
            let token = generateToken()

            database.findUserById(id, (err, user) => {
                let sessions = user.auth.sessions
                sessions.push({
                    'created': new Date(),
                    'useragent': req.get('User-Agent'),
                    'ip': (req.headers['x-forwarded-for'] || req.connection.remoteAddress),
                    'token': token
                })
                database.updateUser(id, user)

                res.cookie('userId', id.toString(), { maxAge: 900000 })
                res.cookie('token', token, { maxAge: 900000 })
                callback(null, res)
            })
        }
    }
}
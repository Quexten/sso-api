let jwt = require('jsonwebtoken')

module.exports = (secret) => {
    return {
        generateToken: (data) => {
            return jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 10) * 1000,
                data: data
            }, secret);
        },
        validateToken: (token) => {
            try {
                jwt.verify(token, secret)
                return true
            } catch (err) {
                return false
            }
        },
        parseToken: (token) => {
            return jwt.decode(token)
        }
    }
}
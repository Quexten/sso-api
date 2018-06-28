let jwt = require('jsonwebtoken')
let tokenExpiration = Math.floor(Date.now() / 1000) + (60 * 10) * 1000

module.exports = (secret) => {
    return {
        generatePrimaryAuthToken: (userId) => {
            return jwt.sign({
                exp: tokenExpiration,
                data: {
                    userId: userId,
                    grant: 'primary'
                }
            }, secret)
        },
        generateSecondaryAuthToken: (userId) => {
            return jwt.sign({
                exp: tokenExpiration,
                data: {
                    userId: userId,
                    grant: 'secondary'
                }
            }, secret);
        },
        validateAuthToken: (token) => {
            try {
                jwt.verify(token, secret)
                return true
            } catch (err) {
                return false
            }
        },
        parseAuthToken: (token) => {
            return jwt.decode(token)
        }
    }
}
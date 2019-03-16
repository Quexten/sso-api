import jwt from 'jsonwebtoken'

export default class JwtHandler {

    constructor (secret) {
        this.secret = secret
    }

    async generateToken (data) {
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 10) * 1000,
            data: data
        }, this.secret);
    }

    async validateToken (token) {
        try {
            jwt.verify(token, this.secret)
            return true
        } catch (err) {
            return false
        }
    }

    async parseToken (token) {
        return (await jwt.decode(token)).data
    }

}

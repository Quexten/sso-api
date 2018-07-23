const TokenGenerator = require('uuid-token-generator');

function generateToken () {
    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62)
    return tokgen.generate()
}

module.exports = function (database, jwtHandler) {
    return {
        validateExchange: async (primaryToken, secondaryToken) => {
            //TODO add secondary validation
            if (!await jwtHandler.validateToken(primaryToken))
                throw new Error('Could not validate tokens')

            let parsedPrimaryToken = await jwtHandler.parseToken(primaryToken)
            let primaryTokenId = parsedPrimaryToken.data.id

            if (parsedPrimaryToken.data.authenticationType !== 'primary')
                throw new Error('Incorrect token submitted')

            //if (! primaryToken.id === secondaryToken.id)
            //    throw new Error('Secondary token bears different id than primary token')

            return primaryTokenId
        },
        createSession: async (id, useragent, ip) => {
            let token = generateToken()

            let user = await database.findUser(id)

            let sessions = user.authentication.sessions
            sessions.push({
                created: new Date(),
                useragent,
                ip,
                token: token
            })

            await database.updateUser(id, user)

            return {
                userId: id.toString(),
                token
            }
        }
    }
}
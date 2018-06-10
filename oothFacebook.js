const FacebookStrategy = require('passport-facebook-token')

module.exports = function({
    clientID,
    clientSecret,
}) {
    return function({
        name,
        registerUniqueField,
        registerProfileField,
        registerStrategyUniqueField,
        registerPassportConnectMethod,
    }) {
        registerUniqueField('id', 'id')
        registerProfileField('id')

        registerPassportConnectMethod('login', new FacebookStrategy({
            clientID,
            clientSecret,
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, {
                id: profile.id
            })
        }))
    }
}

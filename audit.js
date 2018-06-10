const { hashSync, compareSync, genSaltSync } = require('bcrypt-nodejs')
const { randomBytes } = require('crypto')

const SALT_ROUNDS = 1000
const HOUR = 60 * 1000 * 1000

function randomToken() {
    return randomBytes(43).toString('hex')
}

function hash(pass) {
    return hashSync(pass, genSaltSync(SALT_ROUNDS))
}

module.exports = function(onGenerateLoginToken) {
    return function({
        name,
        registerPassportMethod,
        registerMethod,
        registerUniqueField,
        registerProfileField,
        getProfile,
        getUserByUniqueField,
        getUserById,
        getUserByFields,
        getUniqueField,
        updateUser,
        insertUser,
        requireLogged,
        requireNotLogged,
        requireNotRegistered,
        requireRegisteredWithThis
    }) {

        registerUniqueField('username', 'username')
        registerUniqueField('email', 'email')
        registerProfileField('username')
        registerProfileField('email')
        registerMethod('login', function(req, res) {
          const { userId, token } = req.body

          if (!userId) {
              throw new Error('userId required.')
          }

          if (!token) {
              throw new Error('Verification token required.')
          }

          return getUserById(userId)
              .then(user => {

              if (!user) {
                  throw new Error('User does not exist.')
              }

              if (!user[name]) {
              // No email to verify, but let's not leak this information
                 throw new Error('Verification token invalid, expired or already used.')
              }

              var requestToken = token
              var userToken = user[name].loginToken
              var cmp = compareSync(requestToken, userToken)
              console.log(cmp)
              if (!cmp) {
                console.log("ERROR cmp failed")
                throw new Error('Verification token invalid, expired or already used.')
              }
              if (!user[name].loginTokenExpiresAt) {
                throw new Error('Verification token invalid, expired or already used.')
              }
              if (new Date() >= user[name].loginTokenExpiresAt) {
                throw new Error('Verification token invalid, expired or already used.')
              }
              return res.send({
                message: 'Login Success',
                user: getProfile(user)
              })

          })
        })


        registerMethod('generate-login-token', function(req, res) {
          const loginToken = randomToken()
          const email = req.body.email
          console.log("reqemail"+email)
          if (!email) {
            throw new Error('No email to verify')
          }
          return getUserByUniqueField('email', email)
                          .then(user => {
            console.log('user:' + JSON.stringify(user))
            console.log('email:', + email)
            const addToken  = function (id) {
              updateUser(id, {
                loginToken: hash(loginToken),
                loginTokenExpiresAt: new Date(Date.now() + HOUR),
                email: email
              }).then(() => {
                if (onGenerateLoginToken) {
                  onGenerateLoginToken(id, email, loginToken)
                }
                res.send({
                  message: 'Login token generated.'
                })
              })
           }

            if (!user) {
              insertUser({
                    email
                }).then(_id => {
                    addToken(_id)
                })
            } else {
              addToken(user._id)
            }
          })
        })

      }

}

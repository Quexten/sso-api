const { Passport } = require('passport')

const url = require('url')

function Handler(accessToken,refreshToken,profile,done) {
    let defUser = {}

    let newProfile = Object.assign(profile, {
        accessToken,
        refreshToken
    })

    Object.keys(this.defaultUser).forEach((k) => {
        defUser[k] = this.defaultUser[k](newProfile)
    })

    try {
        let [user, created] = this.userModel.findOrCreate({
            defaults: defUser,
            where: {[this.findBy]: defUser[this.findBy]}
        })

        if (!created) user.update(defUser)
          done(null, user)
    } catch(e) {
      done(e, null)
    }
}





function AuthApp(app, config, handler){


  let missing = [
    'credentials',
    'loginURL',
    'strategy',
    'userModel',
    'callbackURL',
    'findBy',
    'defaultUser',
    'successRedirect',
    'failureRedirect',
  ].filter( arg => !config.hasOwnProperty(arg))
  if (missing.length > 0) throw new Error(`Missing args: ${missing.join(',')}`)
  let cc = config.credentials
  Object.keys(cc).forEach((k) => {
    if (typeof cc[k] === "undefined") {
      throw new Error(`credentials error: ${k} is 'undefined'`)
    }
  })

  let passport = new Passport()

  app.use(passport.initialize())

  app.use(passport.session())

  let Options = Object.assign({
    callbackURL: config.callbackURL,
    state: true
  },config.credentials,config.stratConfig || {})

  let _handler = (handler || Handler).bind(config);
  let strategy = new config.strategy(Options,_handler)

  passport.use(strategy)

  passport.serializeUser((user, done) => { 
    done(null, user.id) 
  })

  passport.deserializeUser((id, done) => { 
    config.userModel
      .findById(id)
      .then(user => done(null, user))
      .catch(err => done(err))
  })

  app.get(config.loginURL,
    passport.authenticate(strategy.name, config.authConfig || {})
  );

  app.get(url.parse(config.callbackURL).pathname, 
    passport.authenticate(strategy.name, { 
      failureRedirect: config.failureRedirect,
      successRedirect: config.successRedirect
    }),
    function(err,req,res,next){
      if (err) {
        console.log(`>>>>>> Passport-Auth Exception

${JSON.stringify(err,null,4)}

<<<<<<< check your configuration
          `)
        next(err)
      }
      else {
        next()
      }

    });


}


module.exports = { AuthApp, Handler }


const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var { User } = require('../models/model')

passport.use(new GoogleStrategy(
  {
    clientID: '',
    clientSecret: '',
    callbackURL: ""
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      var user = await User.findOne({ username: profile.provider + '-' + profile.id })

      if (!user) {
        var user = new User({ username: profile.provider + '-' + profile.id, oauth: true })
        await user.save()
      }

      return cb(null, user)

    } catch (error) {
      console.error(error)
    }
  }
));

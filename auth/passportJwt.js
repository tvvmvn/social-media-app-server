const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models/model');
const passport = require('passport');
const opts = {};
require('dotenv').config();

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

  User.findOne({ username: jwt_payload.username }, function (err, user) {
    
    if (err) {
      return done(err, false);
    } 
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });

}));


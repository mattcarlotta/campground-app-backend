const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config/vars');

// Create local Strategy
const localOptions = { usernameField: 'username' };
const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
  // Verify email and password, call done with user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    //compare passwords - is supplied password === user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });

});
// Setup options for jwt Strategy
const jwtOptions = {
  // tell Strategy where to look (from header authorization)
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy || payload = jwt token (sub: user.id and iat: timestamp )
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // See if the user ID in payload exists
  // If it does, call 'done' with user => authenticated
  // otherwise, call done without a user object => not authenticated
  User.findById(payload.sub, function (err, user) {
    if (err) { return done(err, false); }

    if (user) {
      // tell passport found user
      done(null, user);
    } else {
      // tell passport user not found
      done(null, false);
    }
  });
});

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);

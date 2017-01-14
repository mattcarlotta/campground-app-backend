const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config/vars');


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signedin = function(req, res, next) {
  const userid = req.body.id;

  User.findById(userid).exec(function(err, existingUser) {
    if (err) { return next(err) }
    if (!existingUser) { return next(null, false); }
    console.log(existingUser.username);
    res.json({ user: existingUser.username });
  })
}

exports.signin = function(req, res, next) {
  // User has already had email + password auth'd
  // they just need a token
  console.log(req.user.username);
  res.send({ token: tokenForUser(req.user), userId: req.user._id, user: req.user.username });
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;


  if (!email || !username || !password) {
    return res.status(422).send({ error: 'You must provide a valid email, username and password' });
  }
  // check if email already exists
  User.findOne({ email: email, username: username }, function(err, existingUser) {
    if (err) { return next(err) }

      // if email exists, return an error
    if (existingUser) {
      return res.status(422).send( { error: 'That email and/or username is currently in use!' });
    }

      // if new user, create and save user record
    const user = new User({
      email: email,
      username: username,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err) }

      // respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}

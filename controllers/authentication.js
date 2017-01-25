const jwt = require('jwt-simple');
const moment = require('moment');

const User = require('../models/user');
const config = require('../config/vars');
const userHelper = require('../helpers/helpers');


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signedin = function(req, res, next) {
  const decodedId = userHelper.decode(req.body.id);

  User.findById(decodedId).exec(function(err, existingUser) {
    if (err) {
      res.status(401).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
      return next(err)
    }

    if (!existingUser) { return next(null, false); }
    if (existingUser.favorites.length === 0) {
      existingUser.favorites = 'empty';
    }
    res.status(200).json({ user: existingUser.username, joinedAt: existingUser.joinedAt, favorites: existingUser.favorites });
  })
}

exports.signin = function(req, res, next) {
  // User has already had email + password auth'd
  // they just need a token
  const encodedId = userHelper.encode(req.user._id.toString())
  res.send({ token: tokenForUser(req.user), userId: encodedId, user: req.user.username, joinedAt: req.user.joinedAt, favorites: req.user.favorites, message: 'Welcome back to yelp camp!' });
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const joinedAt = moment().unix();


  if (!email || !username || !password) {
    return res.status(422).send({ err: 'You must provide a valid email, username and password' });
  }
  // check if email already exists
  User.findOne({ email: email, username: username }, function(err, existingUser) {
    if (err) return next(err);

      // if email exists, return an error
    if (existingUser) return next(err);

      // if new user, create and save user record
    const user = new User({
      email: email,
      username: username,
      password: password,
      joinedAt: joinedAt
    });

    user.save(function(err) {
      if (err) {
        res.status(422).send( { err: 'That email and/or username is currently in use!' });
        return next(err)
      }

      const encodedId = userHelper.encode(user._id.toString());
      // respond to request indicating the user was created
      res.json({ token: tokenForUser(user), userId: encodedId, user: user.username, joinedAt:user.joinedAt, favorites: user.favorites, message: 'Succesfully signed up! Welcome to yelp camp!'  });
    });
  });
}

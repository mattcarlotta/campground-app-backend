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
  const userId = req.user; // pulled from userHelper isLoggedIn middleware
  const campgroundFields = { id: 1, name: 1, location: 1 }
    User.findById(userId)
    .populate({
        path:"favorites",
        populate:{
          path: 'campground',
          select: campgroundFields,
        }
     })
    .exec(function(err, existingUser) {
      if (err) {
        res.status(401).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
        return next(err)
      }
      if (!existingUser) { return next(null, false); }
      res.status(200).json({ user: existingUser.username, joinedAt: existingUser.joinedAt, favorites: existingUser.favorites });
    })
}


exports.signin = function(req, res, next) {
  const encodedId = userHelper.encode(req.user._id.toString())
  const userId = req.user._id; // pulled
  const campgroundFields = { id: 1, name: 1, location: 1 }
    User.findById(userId)
    .populate({
        path:"favorites",
        populate:{
          path: 'campground',
          select: campgroundFields,
        }
     })
    .exec(function(err, existingUser) {
      if (err) {
        res.status(401).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
        return next(err)
      }
      if (!existingUser) { return next(null, false); }

      res.status(200).json({ token: tokenForUser(req.user), userId: encodedId, user: existingUser.username, joinedAt: existingUser.joinedAt, favorites: existingUser.favorites });
    })
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const joinedAt = moment().unix();
  const favorites = [];


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
      joinedAt: joinedAt,
      favorites: favorites
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

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
      select: 'campground',
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
    res.status(200).json({ user: existingUser.username, joinedAt: existingUser.joinedAt, favorites: existingUser.favorites, message: 'Welcome back to Yelp Camp!' });
  })

}

exports.signin = function(req, res, next) {

  const userId = req.user._id; // pulled
  userHelper.encode(userId.toString()).then((hex) => {
  const encodedId = hex;
  const campgroundFields = { id: 1, name: 1, location: 1 }
    User.findById(userId)
    .populate({
        path:"favorites",
        select: 'campground',
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

      res.status(200).json({ token: tokenForUser(req.user), userId: encodedId, user: existingUser.username, joinedAt: existingUser.joinedAt, favorites: existingUser.favorites, message: 'Welcome back to Yelp Camp!' });
    })
  })
  .catch((err) => {
    console.log(err);
    res.status(403).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
  });
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

      userHelper.encode(user._id.toString()).then((hex) => {
        const encodedId = hex;

        res.json({ token: tokenForUser(user), userId: encodedId, user: user.username, joinedAt:user.joinedAt, favorites: user.favorites, message: 'Succesfully signed up! Welcome to Yelp Camp!'  });
      })
      .catch((err) => {
        console.log(err);
        res.status(403).json({ err: 'There was a problem siging you up. Please notify the admin!' });
      });
    });
  });
}

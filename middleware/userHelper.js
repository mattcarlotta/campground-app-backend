const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');
const userHelper = require('../helpers/helpers');


exports.isLoggedIn = isLoggedIn;


function encryptCurrentUser (req, res, done) {
  const username = req.body.author;

  User.findOne({ username: username }).exec(function(err, existingUser) {
    if (err) return done(({ "err": err } ));
    if (!existingUser) return done(({ "err": err } ));

    const author = {
      id: existingUser._id,
      username: existingUser.username
    }

    req.author = author;
    done();
  });
}

function isLoggedIn (req, res, done) {
  // const encodedId = req.body.userId ? req.body.userId : req.params.id;
  const decodedId = req.body.userId ? userHelper.decode(req.body.userId) : userHelper.decode(req.params.id);
  // const decodedId = userHelper.decode(encodedId);

  User.findById(decodedId).exec(function(err, user) {
    if (err || !user) {
      res.status(401).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
      return done();
    }
    req.user = decodedId;
    return done();
  })
}

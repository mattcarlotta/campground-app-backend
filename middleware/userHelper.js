const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');

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

exports.getCurrentUser = getCurrentUser;

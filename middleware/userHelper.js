const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');
const userHelper = require('../helpers/helpers');

exports.isLoggedIn = function (req, res, done) {
  const decodedId = req.query.userId ? req.query.userId : req.params.id;

  userHelper.decode(decodedId).then((str) => {
    console.log(str);
    userId = str;
    User.findById(userId).exec(function(err, user) {
      if (err || !user) {
        res.status(401).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
        return done();
      }
      req.user = user._id;
      req.username = user.username;
      return done();
    })
    .catch((err) => {
      res.status(404).json({ err: 'Could not locate user, please try again!'})
    });
  });
}

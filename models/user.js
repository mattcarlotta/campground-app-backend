const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  password: String,
  joinedAt: String,
  avatar: String,
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favorite"
    }
  ]
});

// On save hook, encrypt password
// before saving a model (pre-save), run func
userSchema.pre('save', function(next) {
  // get access to instance of user model
  const user = this; // user.email or user.password

  // generate a salt(randomly generated string of characters) then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err); }

    // hash(encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

// Give access to method props
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;

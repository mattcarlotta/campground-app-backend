const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  user: String,
  campgroundId: String,
  campgroundTitle: String
});

module.exports = mongoose.model("Favorite", favoriteSchema);

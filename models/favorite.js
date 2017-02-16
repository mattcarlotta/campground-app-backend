const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  user: String,
  campground:
    {
      type: String,
      ref: "Campground"
    }
});

module.exports = mongoose.model("Favorite", favoriteSchema);

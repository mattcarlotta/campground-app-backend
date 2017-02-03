const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  user: String,
  campground:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campground"
    }
});

module.exports = mongoose.model("Favorite", favoriteSchema);

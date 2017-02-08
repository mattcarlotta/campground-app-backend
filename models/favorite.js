const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  user: String,
  campground:
    {
      type: String,
      ref: "Campground"
    }
});

favoriteSchema.pre('update', function (next) {
    let favorite = this;
    favorite.model('User').update(
        { favorites: favorite._id },
        { $pull: { favorites: favorite._id } },
        { multi: true },
        next);
});

module.exports = mongoose.model("Favorite", favoriteSchema);

const User = require('../models/user');
const Favorite = require('../models/favorite');

exports.createFavorite = function(req, res, done){
  const newFavorite = { user: req.user, campground: req.body.campgroundId };

  Favorite.create(newFavorite, function(err, favorite){
    if (err) return res.status(500).json({ message: 'Oops! Something went wrong!' });
    User.update({ _id: req.user }, { $push: { favorites: favorite }}, function(err){
      if(err) return res.status(500).json({ err: 'There was a problem saving this favorite' });
      res.status(201).json({ message: 'Succesfully added to favorites!' });
    });
  });

}

exports.fetchFavorites = function(req, res, done) {
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
      res.status(200).json({ favorites: existingUser.favorites });
    })
}

exports.deleteFavorite = function(req, res){
  // const userId = req.user;
  Favorite.findByIdAndRemove(req.body.favoriteId, function(err){
    if(err){
      res.status(500).json({ err: 'There was a problem removing the favorite, please try again later' });
    } else {
      res.status(201).json({ message: 'Successfully removed from your favorites!' });
    }
  });
}

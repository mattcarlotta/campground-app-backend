const User = require('../models/user');
const Favorite = require('../models/favorite');

exports.createFavorite = createFavorite;


function createFavorite(req, res, done){
  const newFavorite = { user: req.user, campground: req.body.campgroundId };
  console.log(req.user);
  Favorite.create(newFavorite, function(err, favorite){
    if (err) return res.status(500).json({ message: 'Oops! Something went wrong!' });
    User.update({ _id: req.user }, { $push: { favorites: favorite }}, function(err){
      if(err) return res.status(500).json({ err: 'There was a problem saving this favorite' });
      console.log(req.user);
      res.status(201).json({ message: 'Succesfully added to favorites!' });
    });
  });

}

 //
 // User.findById(decodedId).exec(function(err, existingUser) {
 //    if (err) {
 //      res.status(401).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
 //      return done(err)
 //    }
 //
 //    if (!existingUser) {
 //      res.status(401).json({ err: 'There was a problem locating your username!' });
 //      return done();
 //    }
 //
 //    Favorite.create(newFavorite, function(err, favorite){
 //      if (err) return (err);
 //
 //      res.status(201).json({ message: 'Succesfully added to favorites!' });
 //    });

  //});
//}
// exports.create = function(req, res, done){
//   const decodedId = userHelper.decode(req.body.userId);
//   const newFavorite = { campgroundId: req.body.campgroundId, campgroundTitle: req.body.campgroundTitle };
//   console.log('decodedId', decodedId);
//   console.log('req.body', req.body);

  // User.findById(decodedId).exec(function(err, existingUser) {
  //   if (err) {
  //     res.status(401).json({ err: 'There was a problem with your login credentials. Please sign in again!' });
  //     return done(err)
  //   }
  //   if (!existingUser) {
  //     res.status(401).json({ err: 'There was a problem locating your username!' });
  //     return done();
  //   }
  //   Campground.findById(req.body.campgroundId, function(err, foundCampground){
  //     if(err){
  //       res.status(404).json({ err: 'There was a problem locating the campground, please try again later' });
  //       return done();
  //       }
  //     if (!foundCampground) {
  //       res.status(404).json({ err: 'There was a problem locating the campground. It was either deleted or does not exist!' });
  //       return done();
  //       }
  //   });
  //     existingUser.favorites.push(newFavorite);
  //     // existingUser.save();
  //     res.status(201).json({ message: 'Succesfully added to favorites!' });
  //     done();
  // });
// }

exports.deleteFavorite = function(req, res){
  console.log(req.body);
// 	Campground.findByIdAndRemove(req.params.id, function(err, message){
//     if(err){
//         res.status(500).json({ err: 'There was a problem deleting the campground, please try again later' });
//       } else {
//         res.status(201).json({ message: 'Succesfully deleted the campground!' });
//     }
//   });
}

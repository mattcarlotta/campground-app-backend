const Campground  = require("../models/campground");
const Comment = require('../models/comment');
const ObjectId = require('mongoose').Types.ObjectId;

//============================================================//
/* COMMENT CREATE Route -- create a new comment */
//============================================================//
exports.createComment = function(req, res){
  if (!req.user) res.status(403).json({ err: 'You must be logged in to do that!'})

    Comment.create(req.body.comment, function(err, comment) {
      if(err) res.status(500).json({ err: 'There was a problem adding the comment, please try again later' });

      else Campground.update({ _id: req.body.id}, { $push: { comments: comment }}, function(err,campground){
        if(err || !campground) res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });

        else res.status(201).json({ message: 'Succesfully added the comment!'});
      });
    });
};

//============================================================//
/* COMMENT UPDATE */
//============================================================//
exports.updateComment = function(req, res){
  Comment.findById(req.params.id, function(err, foundComment) {
    if (req.username !== foundComment.author) res.status(403).json({ denied: 'You do not have permission to do that!'});

      else Comment.update({_id: req.params.id}, req.body.comment, function(err, updatedComment){
        if(err) res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });

        else res.status(201).json({ message: 'Succesfully edited the comment!'});
      });
  });
}

//============================================================//
/* COMMENT DESTROY */
//============================================================//
exports.deleteComment = function(req, res){
  Comment.findById(req.params.id, function(err, foundComment) {
    if (req.username !== foundComment.author) res.status(403).json({ denied: 'You do not have permission to do that!'});

    else foundComment.remove(req.params.id, function(err) {
        if (err) res.status(404).json({ err: 'There was a problem removing the comment, please try again later' });

        else Campground.findById(req.query.campgroundId, function(err, foundCampground){
          if (err || !foundCampground) res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });

        else foundCampground.comments.remove(req.params.id);
          foundCampground.save();
          res.status(201).json({ message: 'Succesfully deleted the comment!' });
      });
    });
  });
}

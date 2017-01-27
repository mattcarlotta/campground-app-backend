const Campground  = require("../models/campground");
const Comment = require('../models/comment');

//============================================================//
/* COMMENT CREATE Route -- create a new comment */
//============================================================//
exports.create = function(req, res){
  const campgroundId = req.body.id;

  Campground.findById(campgroundId, function(err,campground){
        if(err){
          res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });
        } else  {
            Comment.create(req.body.comment, function(err, comment){
              if(err){
                res.status(500).json({ err: 'There was a problem adding the comment, please try again later' });
              } else {
                  // save comment
                  comment.save();
                  // push new comment into array
                  campground.comments.push(comment);
                  // connect to new comment to the campground
                  campground.save();
                  //redirect to campground show page
                  res.status(201).json({ message: 'Succesfully added the comment!'});
                }
            });
        }
    });
};

//============================================================//
/* COMMENT UPDATE */
//============================================================//
exports.update = function(req, res){
  Comment.findByIdAndUpdate(req.body.commentId, req.body.comment, function(err, updatedComment){
    if(err){
        res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });
      } else {
        res.status(201).json({ message: 'Succesfully edited the comment!'});
    }
  });
}

//============================================================//
/* COMMENT DESTROY */
//============================================================//
exports.delete = function(req, res){
  Campground.findById(req.body.id, function(err,campground){
    if(err){
      res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });
    } else {
      campground.comments.remove(req.body.commentId);
      campground.save();
      Comment.findByIdAndRemove(req.params.id, function(err){
        if(err){
          res.status(500).json({ err: 'There was a problem deleting the comment, please try again later' });
        } else {
          res.status(201).json({ message: 'Succesfully deleted the comment!' });
        }
      });
    }
  });
}

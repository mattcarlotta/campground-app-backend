const Campground  = require("../models/campground");
const Comment = require('../models/comment');

//============================================================//
/* COMMENT CREATE Route -- create a new comment */
//============================================================//
exports.create = function(req, res){
  Campground.findById(req.params.id, function(err,campground){
        if(err){
          res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });
        } else  {
            Comment.create(req.body.comment, function(err, comment){
              if(err){
                req.flash("error", "Something went wrong!");
                console.log(err);
              } else {
                  // add username and id to comment from Schema (commentSchema->author->id)
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  // save comment
                  comment.save();
                  // push new comment into array
                  campground.comments.push(comment);
                  // connect to new comment to the campground
                  campground.save();
                  //redirect to campground show page
                  res.status(201).json({ updatedCampground: 'Succesfully edited the comment!'});
                }
            });
        }
    });
};

//============================================================//
/* COMMENT UPDATE */
//============================================================//
exports.update = function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
        res.status(500).json({ err: 'There was a problem updating the comment, please try again later' });
      } else {
        res.status(201).json({ updatedCampground: 'Succesfully edited the comment!'});
    }
  });
}

//============================================================//
/* COMMENT DESTROY */
//============================================================//
exports.delete = function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.status(500).json({ err: 'There was a problem deleting the comment, please try again later' });
    } else {
      res.status(201).json({ message: 'Succesfully deleted the comment!' });
    }
  });
}

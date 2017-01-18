const Campground = require('../models/campground');

exports.index = function(req, res){
	Campground.find({}, function(err, allCampgrounds){
      if(err){
        res.status(500).json({ error: 'error' });
      } else {
        res.status(201).json({campgrounds: allCampgrounds});
			}
	});
}

exports.create = function(req, res){
	const newCampground = req.body;
  Campground.create(newCampground, function(err, message){
    if(err){
        res.status(500).json({ err: 'There was a problem creating the campground, please try again later' });
      } else {
        res.status(201).json({ message: 'Succesfully added a new campground!' });
      }
  });
}

exports.show = function(req, res){
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  if(err){

      res.status(404).json({ err: 'There was a problem locating the campground, please try again later' });
    } else if (!foundCampground) {
			res.status(404).json({ err: 'There was a problem locating the campground. It was either deleted or does not exist!' });	
		} else {
      // render show template with that campground ID
    	res.status(201).json({campground: foundCampground});
		}
	});
}

exports.update = function(req, res){
	var updateCampground = req.body;
  Campground.findByIdAndUpdate(updateCampground.id, updateCampground, function(err, updatedCampground){
    if(err){
        res.status(404).json({ err: 'There was a problem updating the campground, please try again later' });
      } else {
        res.status(201).json({ updatedCampground: 'Succesfully edited the campground!'});
    }
  });
}

exports.delete = function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, message){
    if(err){
        res.status(500).json({ err: 'There was a problem deleting the campground, please try again later' });
      } else {
        res.status(201).json({ message: 'Succesfully deleted the campground!' });
    }
  });
}

const Campground = require('../models/campground');

exports.indexCampgrounds = function(req, res){
	Campground.find({}, function(err, allCampgrounds){
      if(err){
        res.status(500).json({ error: 'error' });
      } else {
        res.status(201).json({campgrounds: allCampgrounds});
			}
	});
}

exports.createCampground = function(req, res){
	const newCampground = req.body;
	if (!req.user) {
		res.status(403).json({ err: 'You must be logged in to do that!'})
	} else {
		Campground.create(newCampground, function(err, message){
			if(err){
					res.status(500).json({ err: 'There was a problem creating the campground, please try again later' });
				} else {
					res.status(201).json({ message: 'Succesfully added a new campground!' });
				}
		});
	}
}

exports.showCampgrounds = function(req, res){
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

exports.updateCampground = function(req, res){
	const updateCampground = req.body;
	Campground.findById(updateCampground.id, function(err, foundCampground){
		if (err) {
			res.status(404).json({ err: 'There was a problem updating the campground, please try again later' });
		} else if (req.username !== foundCampground.author) {
				res.status(403).json({ denied: 'You do not have permission to do that!'});
		} else {
			foundCampground.update(updateCampground, function(err, updatedCampground){
		    if(err){
		      res.status(404).json({ err: 'There was a problem updating the campground, please try again later' });
				}
	        res.status(201).json({ updatedCampground: 'Succesfully edited the campground!'});
		  });
		}
	});
}

exports.deleteCampground = function(req, res){
	console.log(req.params.id);
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err) {
			res.status(404).json({ err: 'There was a problem updating the campground, please try again later' });
		} else if (req.username !== foundCampground.author) {
				res.status(403).json({ denied: 'You do not have permission to do that!'});
		} else {
			foundCampground.remove(req.params.id, function(err, message){
		    if(err){
		       res.status(500).json({ err: 'There was a problem deleting the campground, please try again later' });
		      }
		      res.status(201).json({ message: 'Succesfully deleted the campground!' });
		  });
		}
	});
}

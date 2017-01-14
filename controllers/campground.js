const Campground = require('../models/campground');

exports.index = function(req, res){
	Campground.find({}, function(err, allCampgrounds){
      if(err){
        console.log(err);
      } else {
        res.status(201).json({campgrounds: allCampgrounds});
			}
	});
}

exports.create = function(req, res){
	const newCampground = req.body;
  Campground.create(newCampground, function(error, message){
    if(error){
        res.status(500).json({ error: error });
      } else {
        res.status(201).json({ message: "Success", error: '' });
      }
  });
}

exports.show = function(req, res){
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  if(err){
      res.status(404).json({ error: error });
    } else {
      // render show template with that campground ID
    	res.status(201).json({campground: foundCampground});
    }
	});
}
exports.update = function(req, res){
	var updateCampground = req.body;
  Campground.findByIdAndUpdate(updateCampground.id, updateCampground, function(error, updatedCampground){
    if(error){
        res.status(404).json({ error: error });
      } else {
        res.status(201).json({
          message: "Success",
          error: '',
          updatedCampground: req.params.id
      });
    }
  });
}
exports.delete = function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(error, message){
    if(error){
        res.status(500).json({ error: error });
      } else {
        res.status(201).json({ message: "Success", error: '' });
    }
  });
}

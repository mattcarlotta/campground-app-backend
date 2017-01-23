var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  text: String,
  author: {
    type: String,
  }
});

module.exports = mongoose.model("Comment", commentSchema);

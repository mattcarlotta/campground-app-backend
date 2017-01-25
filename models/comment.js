const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: String,
  postedAt: String,
  author: String,
});

module.exports = mongoose.model("Comment", commentSchema);

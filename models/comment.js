const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: String,
  postedAt: String,
  updated: {
    type: Boolean,
    default: false
  },
  updatedAt: String,
  author: String,
});

module.exports = mongoose.model("Comment", commentSchema);

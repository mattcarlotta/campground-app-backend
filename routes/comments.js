const express   = require("express");
const app    = express.Router();

const Comment = require('../controllers/comment');

app.post("/new", Comment.createComment);
app.put("/edit/:id", Comment.updateComment);
app.post("/delete/:id", Comment.deleteComment);

module.exports = app;

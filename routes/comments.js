const express   = require("express");
const app    = express.Router();

const Comment = require('../controllers/comment');

app.post("/new", Comment.create);
app.put("/edit/:id", Comment.update);
app.post("/delete/:id", Comment.delete);

module.exports = app;

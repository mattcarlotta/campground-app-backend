const express   = require("express");
const app    = express.Router();
const passport  = require("passport");

const Comment = require('../controllers/comment');

const passportService = require('../middleware/passport');
const auth = require('../middleware/userHelper');

const requireToken = passport.authenticate('jwt', { session: false });

app.post("/new", requireToken, Comment.createComment);
app.put("/edit/:id", requireToken, Comment.updateComment);
app.post("/delete/:id", requireToken, Comment.deleteComment);

module.exports = app;

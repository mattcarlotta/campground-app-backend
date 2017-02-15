const express   = require("express");
const app    = express.Router();
const passport  = require("passport");

const Comment = require('../controllers/comment');

const passportService = require('../middleware/passport');
const auth = require('../middleware/userHelper');

const requireToken = passport.authenticate('jwt', { session: false });

app.post("/new", requireToken, auth.isLoggedIn, Comment.createComment);
app.put("/edit/:id", requireToken, auth.isLoggedIn, Comment.updateComment);
app.delete("/delete/:id", requireToken, auth.isLoggedIn, Comment.deleteComment);

module.exports = app;

const express   = require("express");
const app    = express.Router();
const passport  = require("passport");

const Favorite = require('../controllers/favorite');

const passportService = require('../middleware/passport');
const auth = require('../middleware/userHelper');

const requireToken = passport.authenticate('jwt', { session: false });

app.post("/create", requireToken, auth.isLoggedIn, Favorite.createFavorite);
app.get("/:id", requireToken, auth.isLoggedIn, Favorite.fetchFavorites);
app.delete("/delete/:id", requireToken, auth.isLoggedIn, Favorite.deleteFavorite);

module.exports = app;

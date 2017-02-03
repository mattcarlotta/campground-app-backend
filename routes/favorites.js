const express   = require("express");
const app    = express.Router();

const Favorite = require('../controllers/favorite');
const auth = require('../middleware/userHelper');

app.post("/create", auth.isLoggedIn, Favorite.createFavorite);
app.post("/delete/:id", Favorite.deleteFavorite);

module.exports = app;

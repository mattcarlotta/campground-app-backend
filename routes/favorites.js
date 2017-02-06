const express   = require("express");
const app    = express.Router();

const Favorite = require('../controllers/favorite');
const auth = require('../middleware/userHelper');

app.post("/create", auth.isLoggedIn, Favorite.createFavorite);
app.get("/:id", auth.isLoggedIn2, Favorite.showFavorite);
app.post("/delete/:id", Favorite.deleteFavorite);

module.exports = app;

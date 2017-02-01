const express   = require("express");
const app    = express.Router();

const Favorite = require('../controllers/favorite');

app.post("/create", Favorite.createFavorite);
app.post("/delete/:id", Favorite.deleteFavorite);

module.exports = app;

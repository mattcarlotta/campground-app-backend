const express   = require("express");
const app    = express.Router();

const Campground = require('../controllers/campground');
// const userHelper = require('../middleware/userHelper');

app.get("/", Campground.indexCampgrounds);
app.post("/new", Campground.createCampground);
app.get("/:id", Campground.showCampgrounds);
app.put("/edit/:id", Campground.updateCampground);
app.delete("/delete/:id", Campground.deleteCampground);

module.exports = app;

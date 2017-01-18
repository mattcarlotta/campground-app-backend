const express   = require("express");
const app    = express.Router();

const Campground = require('../controllers/campground');
// const userHelper = require('../middleware/userHelper');

app.get("/", Campground.index);
app.post("/new", Campground.create);
app.get("/:id", Campground.show);
app.put("/edit/:id", Campground.update);
app.delete("/delete/:id", Campground.delete);

module.exports = app;

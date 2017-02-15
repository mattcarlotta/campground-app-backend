const express   = require("express");
const app    = express.Router();
const passport  = require("passport");

const Campground = require('../controllers/campground');

const passportService = require('../middleware/passport');
const auth = require('../middleware/userHelper');

const requireToken = passport.authenticate('jwt', { session: false });

app.get("/", Campground.indexCampgrounds);
app.post("/new", requireToken, auth.isLoggedIn, Campground.createCampground);
app.get("/:id", Campground.showCampgrounds);
app.put("/edit/:id", requireToken, auth.isLoggedIn, Campground.updateCampground);
app.delete("/delete/:id", requireToken, auth.isLoggedIn, Campground.deleteCampground);

module.exports = app;

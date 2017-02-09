const express   = require("express");
const app    = express.Router();
const passport  = require("passport");

const Campground = require('../controllers/campground');

const passportService = require('../middleware/passport');
const auth = require('../middleware/userHelper');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

app.get("/", Campground.indexCampgrounds);
app.post("/new", Campground.createCampground);
app.get("/:id", requireAuth, Campground.showCampgrounds);
app.put("/edit/:id", requireAuth, Campground.updateCampground);
app.delete("/delete/:id", Campground.deleteCampground);

module.exports = app;

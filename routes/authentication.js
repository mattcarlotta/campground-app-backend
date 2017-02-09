const express   = require("express");
const app    = express.Router();
const passport  = require("passport");

const Authentication = require('../controllers/authentication');
const passportService = require('../middleware/passport');
const auth = require('../middleware/userHelper');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


app.post("/signup", Authentication.signup);
app.post("/signin", requireSignin, Authentication.signin);
app.post("/signedin", requireAuth, auth.isLoggedIn, Authentication.signedin);
module.exports = app;

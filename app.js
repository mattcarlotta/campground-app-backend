const express     = require('express');
const app         = express();
const http        = require('http');
const bodyParser  = require('body-parser');
const mongoose    = require("mongoose");
const morgan      = require('morgan');
const cors        = require('cors');
//============================================================//
/* REQUIRED ROUTES */
//============================================================//
const Campground    = require("./models/campground");
    // Comment       = require("./models/comment"),
    // seedDB        = require("./seeds"),
    // User          = require("./models/user");

// var commentRoutes    = require("./routes/comments"),
const campgroundRoutes = require("./routes/campgrounds");
const authRoutes       = require("./routes/authentication");
    // resultRoutes     = require("./routes/results");

//============================================================//
//* SERVER & APP CONFIG */  //============================================================//
const port = process.env.PORT || 3001;
const db = require('./config/db');
const config = require('./config/vars');

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url);
// Use bluebird for mongoose promises
mongoose.Promise = require('bluebird');
mongoose.connection.on("connected", function(){
   console.log("Connected on " + db.url);
});

mongoose.connection.on("disconnected", function(){
  console.log("Diconnected from " + db.url);
});

mongoose.connection.on("error", function(){
  console.log("Connection Error");
});

process.on("SIGINT", function(){
  mongoose.connection.close(function(){
    console.log("Mongoose Diconnected =)");
    process.exit(0)
  });
});


//============================================================//
/* APP CONFIGS */
//============================================================//
app.use(morgan('combined')); // logging framework
app.use(cors()); // middleware to handle domain and port connections
app.use(bodyParser.json({ type: '*/*' }));

app.set('json spaces', 2);

//============================================================//
/* ROUTER PREFIX CONFIGS */
//============================================================//
app.use(authRoutes);
// appends all routes with "/campgrounds" in front of them
app.use("/campgrounds", campgroundRoutes)
// app.use("/campgrounds/:id/comments", commentRoutes);
// app.use(resultRoutes);


// start app ===============================================
// http.createServer(app);
app.listen(port, function(){
  console.log("Server is now listening on port " + port);
});

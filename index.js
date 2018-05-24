const express = require("express");
const mongoose = require("mongoose");
const bodyParser=  require("body-parser");
const passport = require("passport");
var http = require('http');
const cookieSession = require("cookie-session");
require("./models/User");
require("./models/Group");
require("./models/Posts");
require("./models/Comments");
require("./models/Friends");
require("./services/passport");
mongoose.connect("mongodb://admin:admin@ds215910.mlab.com:15910/groupon")
const app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(cookieSession({
  name: 'session',
  keys: ['abc123random'],
  maxAge: 24 * 60 * 60 * 1000
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require("./routes/basicRoutes")(app,io);

server.listen(process.env.PORT || 5000,()=> console.log('server listening on PORT 5000'));

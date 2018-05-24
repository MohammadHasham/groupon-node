const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");

passport.serializeUser((user,done)=>{
  console.log(user);
  done(null,user.id);
});
passport.deserializeUser((id,done)=>{
  User.findById(id,(err,user) =>{
    done(null,user);
  });
});


passport.use(new GoogleStrategy({
    clientID: "595127984167-aohu50att4a1sgve0fir523h2sgole28.apps.googleusercontent.com",
    clientSecret: "ymX5Hd1JZU04KdUj8Ozeh1Hz",
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async(accessToken, refreshToken, profile, done)=>{
    console.log(profile);
    const existingUser = await User.findOne({ googleId: profile.id });
    if(existingUser){
      return done(null,existingUser);
    }
    const newUser = await new User({googleId: profile.id,username:profile.displayName,displayImage:profile.photos[0].value}).save();
    return done(null,newUser);

  }
));

passport.use('login',new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      bcrypt.compare(password, user.password, function(err, res) {
				if (res == false) {
					return done(null, false);
				}
				return done(null, user);
			});
    });
  }
));
  passport.use('register',new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (user) {return done(null, false); }
        else{
					var newUser = new User();
					newUser.username = username;
					newUser.password = password;
					newUser.save(function(err) {
						if (err) throw err;
						return done(null, newUser);
					});
        }
      });
    }
  ));

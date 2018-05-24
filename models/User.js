const mongoose = require("mongoose");
const {Schema} = mongoose;
const bcrypt= require("bcrypt");
SALT_WORK_FACTOR = 10;
const User = new Schema({
  googleId:String,
  username:String,
  password:String,
  displayImage:String,
  groups:[{type:mongoose.Schema.ObjectId,ref:"Group"}],
  friends: [{type:mongoose.Schema.ObjectId,ref:"Friends"}]
});

User.pre("save",function(next,done){
  var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
})
mongoose.model("User",User);

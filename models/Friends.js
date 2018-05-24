const mongoose = require("mongoose");
const {Schema} = mongoose;

const Friends = new Schema({
  name:[{type:mongoose.Schema.ObjectId,ref:'User'}],
  username:String
});

mongoose.model("Friends",Friends);

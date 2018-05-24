const mongoose = require("mongoose");
const {Schema} = mongoose;

const Group = new Schema({
  name:String,
  users:[{type:mongoose.Schema.ObjectId,ref:"User"}],
  posts:[{type:mongoose.Schema.ObjectId,ref:"Posts"}],
  img:String,
  interest:String
});

mongoose.model("Group",Group);

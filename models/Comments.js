const mongoose = require("mongoose");
const {Schema} = mongoose;

const Comments = new Schema({
  comment: {type: String, required:true},
  postId: String,
  postedBy:String
});

mongoose.model("Comments",Comments);

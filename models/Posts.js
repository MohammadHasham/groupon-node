const mongoose = require("mongoose");
const {Schema} = mongoose;

const Posts = new Schema({
  postName: {type:String,required:true},
  postAdmin: [{type:mongoose.Schema.ObjectId,ref:"User"}],
  likeCount:Number,
  image:String,
  postContent:String,
  comments:[{type:mongoose.Schema.ObjectId,ref:"Comments"}]
});

mongoose.model("Posts",Posts);

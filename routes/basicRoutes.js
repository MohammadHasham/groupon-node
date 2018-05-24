const mongoose = require("mongoose");
const Group = mongoose.model("Group");
const User = mongoose.model("User");
const Posts = mongoose.model("Posts");
const Comments = mongoose.model("Comments");
const Friends = mongoose.model("Friends");
const cleanCache = require("../middlewares/cleanCache");
const {clearHash} = require("../services/cache");
let users = [];
let onlineUsers = [];
let privateUsers = [];
var ObjectId = mongoose.Types.ObjectId;
module.exports = (app,io) => {
  app.post("/api/creategroup", async (req, res) => {
    console.log(req.user);
    const group = new Group({
      name: req.body.name,
      users:req.user.id,
      interest:req.body.interest,
      img:req.body.img
    });
    const result = await group.save();
    const user =await User.findOneAndUpdate({_id:req.user.id},{$push:{"groups":result._id}})
    res.send(result);
  });
  app.post('/api/filter',cleanCache,async (req,res)=>{
    if(!req.body.interest){
        const data = await Group.find({}).cache({key:req.user.id}).cache({key:req.user.id});
        res.send(data);
        return;
    }
    const data = await Group.find({interest:req.body.interest}).cache({key:req.user.id});
    res.send(data);
  });
  app.post("/api/getgroups", cleanCache,async (req, res) => {
    const groups = await Group.find({_id:req.body.id}).populate('users').populate('posts').cache({key:req.user.id}).exec();
    res.send(groups);
  });
  app.get("/api/getuser",cleanCache,async (req,res)=>{
    const user = await User.find({_id:req.user.id}).populate({path:'friends',populate:{path:'name',model:'User'}}).populate('groups').cache({key:req.user.id}).exec();
    res.send(user);
  });
  app.post("/api/getuser",async (req,res)=>{
    const user = await User.find({_id:req.body.id}).populate({path:'friends',populate:{path:'name',model:'User'}}).populate('groups').exec();
    res.send(user);
  });
  app.post("/api/getprofile",cleanCache,async (req,res)=>{
    const user = await User.find({_id:req.body.id}).populate('groups').cache({key:req.user.id}).exec();
    res.send(user);
  });
  app.post("/api/filter/query",cleanCache, async (req, res) => {
    //query shall be replaced with actual query when doing frontned.
    const groups = await Group.find({
      name: { $regex: req.body.name, $options: "i" }
    }).cache({key:req.user.id});
    res.send(groups);
  });

  app.post('/api/addpost/query',async (req,res)=>{
    //groupId and postId are required.
    const result = await Group.findOneAndUpdate({_id:req.body.groupId},{$push:{"posts":req.body.postId}});
    res.send(result);
  });

  app.post('/api/createpost',async (req,res)=>{
    const Post = new Posts({
      postName: req.body.content,
      postAdmin: req.user.id,
      postContent:req.body.postName,
      image:req.body.image,
      likeCount:0
    });
    const result = await Post.save();
    const group = await Group.findOneAndUpdate({_id:req.user.id},{$push:{"posts":result._id}});
    res.send(result);
  });
  app.post('/api/getposts',cleanCache,async (req,res)=>{
    const Post = await Group.find({_id:req.body.id}).populate('posts').cache({key:req.user.id}).exec();
    res.send(Post);
  });

  app.post('/api/post/like',async (req,res)=>{
    const like = await Posts.findOneAndUpdate({_id:req.body.id},{$inc:{"likeCount":1}},{new:true})
    res.send(like);
  });
  app.post('/api/post/dislike',async (req,res)=>{
    const dislike = await Posts.findOneAndUpdate({_id:req.body.id,likeCount:{$gt:0}},{$inc:{"likeCount":-1}},{new:true})
    res.send(dislike);
  });
  app.post('/api/post/comment',async (req,res)=>{
    const newComment = new Comments({
      comment:req.body.text,
      postId:req.body.id,
      postedBy:req.user.id
    });
    const cmt = await newComment.save();
    const comment = await Posts.findOneAndUpdate({_id:req.body.id},{$push:{"comments":cmt._id}},{new:true});
    res.send(cmt);
  });
  app.post('/api/getcomments',cleanCache,async (req,res)=>{
    const result = await Posts.find({_id:req.body.id}).populate('comments').cache({key:req.user.id});
    res.send(result);
  });
  app.post('/api/delete/post',async (req,res)=>{
    const delPost = await Posts.remove({_id:req.body.id});
    //to be done
  });
  app.post('/api/delete/comment',async (req,res)=>{
      //id:comment's Id, postId:post's Id
      const del = await Comments.remove({_id:req.body.id},{new:true});
      const delComment = await Posts.findOneAndUpdate({_id:req.body.postId},{$pull:{"comments":req.body.id}},{new:true});
      res.send(del);
  });
  app.post('/api/getfriends',async (req,res)=>{
    if(req.body.id){
      const result = await User.find({_id:req.body.id}).populate('friends').exec();
       res.send(result);
       return;
    }else{
      const result = await User.find({_id:req.user.id}).populate('friends').exec();
       res.send(result);
    }
  });
  app.post('/api/acceptrequest',async(req,res)=>{
    console.log(req.body);
    let id = req.body.username
    console.log('accept request id',id);
    console.log('original id',req.user.id);
    const idFriend = await User.findOne({_id:id});
    const friend = new Friends({
      name: idFriend._id,
      username: idFriend.username
    });
    const result = await friend.save();
    const updatedUser = await User.findOneAndUpdate({_id:req.user.id},{$push:{"friends":result._id}},{upsert:true,new:true});
    const anotherFriend = new Friends({
      name:updatedUser._id
    });
    const anotherResult = await anotherFriend.save();
    const accepter = await User.findOneAndUpdate({_id:id},{$push:{"friends":anotherResult._id}},{upsert:true,new:true});
    res.send(updatedUser);
  });
  app.get('/api/getgroups',cleanCache,async (req,res)=>{
    const groups = await Group.find({}).populate('users').populate('posts').exec();
    res.send(groups);
  });
  app.post('/api/groupname',async (req,res)=>{
    const group = await Group.find({_id:req.body.id});
    res.send(group);
  });
  app.post('/api/groupmembers',async (req,res)=>{
    const group = await Group.find({_id:req.body.id}).populate('users').exec();
    res.send(group);
  });
  app.post('/api/joingroup',async (req,res)=>{
    const join = await Group.findOneAndUpdate({_id:req.body.id},{$push:{"users":req.user.id}});
    const user =await User.findOneAndUpdate({_id:req.user.id},{$push:{"groups":req.body.id}});
    res.send(user);
  });
  //private chat
      io.on('connection',(socket)=>{
        socket.on("onlineUsers",(data)=>{
          privateUsers.push(socket.id);
          io.emit('onlineUpdate',privateUsers);
        });
        socket.on("userProfile",(data)=>{
          console.log(data);
            users.push(...data);
            io.emit('updates',users);
        });
        socket.on('sendMessage',(data)=>{
          console.log(data.to,data.from)
          io.to(data.to).emit('reply',{from:data.from,msg:data.msg})
        })

  //group chat
   socket.on('joinGroup',(name)=>{
     socket.join(name.groupName,()=>{
      onlineUsers.push({...name,socketId:socket.id});
       io.sockets.in(name.groupName).emit('message',{username:name.username,msg:name.message,online:onlineUsers} )
     });
   });
   //notifications
   socket.on('sendRequest',(id,from,user)=>{
     io.to(id.socketId).emit('newRequest',{message:"You have a new friend request from",user:id.id,from:from,username:id.username,user});
   });
     });
};

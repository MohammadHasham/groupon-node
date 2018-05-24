import React,{Component} from "react";
import {getUser,addNotifications,changeNotification} from '../actions';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import io from 'socket.io-client';
import axios from "axios";
import Navbar from "./Navbar";
import PendingRequest from "./PendingRequest";
const socket = io.connect('http://localhost:5000');
class Members extends Component{
  constructor(props){
    super(props);
    this.state = {text:"",messages:[],onlineUsers:[],allMembers:[],privatemsg:[],pmText:"",notifications:[],notify:false}
  }
  componentWillMount(){
    this.props.getUser();
    axios.post('/api/groupname',{id:this.props.match.params.id}).then((result,err)=>{
      this.setState({user:result.data[0].name})
      let {username,_id} = this.props.user[0];
      socket.emit('joinGroup',{groupName:this.state.user,username,id:_id,message:this.state.text});
    });
    axios.post('/api/groupmembers',{id:this.props.match.params.id}).then((result,err)=>{
      this.setState({allMembers:[...result.data[0].users]})
    })
    socket.on('message',(data)=>{
      this.setState({messages:[...this.state.messages,{username:data.username,msg:data.msg}],onlineUsers:[...data.online]})
    });
    socket.on('reply',(data)=>{
      this.setState({privatemsg:[...this.state.privatemsg,data]})
    });
    socket.on('newRequest',(data)=>{
      this.props.addNotifications(data);
      this.setState({notifications:[...this.state.notifications,data]})
    });
  }
  renderDetails = ()=>{
    if(!this.props.user) return
    return this.props.user.map((item)=>{
    return(
      <div>
      <h3>{item.username}</h3>
      <img src={item.displayImage} className="img-thumbnail rounded img-fluid mx-auto d-block"/>
      </div>
    );
    });
  }
  submitMessage =()=>{
    let {username,_id} = this.props.user[0];
    socket.emit('joinGroup',{groupName:this.state.user,username,id:_id,message:this.state.text});
    this.setState({text:""})
  }
  renderMessages = ()=>{
    return this.state.messages.map((item)=>{
      if(item.msg == "") return;
      return(
      <li style={{listStyleType:"none",backgroundColor:"#FAFAFA",padding: "4%",marginTop: "1%",borderRadius: "2%"}}>
      <h6>{item.username}</h6><img src={item.displayImage} className="img-fluid img-circle"/>{item.msg}
      </li>

    );
    });
  }
  renderMembers = () =>{
    return this.state.onlineUsers.filter((item)=> item.username !== this.props.user[0].username).
    filter((item,index,self)=>index == self.findIndex((a)=> a.username == item.username))
    .map((item)=>{
      console.log(item);
      return (
      <li style={{listStyleType:"none"}}>{item.username}
      <button className="btn btn-primary" style={{float:"right"}} onClick={()=>this.addFriend(item,this.props.user[0]._id,this.props.user[0].username)}>Add Friend</button>
      <input placeholder="Enter Message . . ." value={this.state.pmText} style={{marginTop:"10%",display:"block"}} type="text" className="form-control" onChange={(e)=>this.setState({pmText:e.target.value})}/>
      <button onClick={()=>this.spread(item.socketId)} style={{marginTop:"8%",display:"block"}} className="btn btn-primary mx-auto">Private Message</button>
      </li>
    );
    });
  }
  join = () =>{
    axios.post('/api/joingroup',{id:this.props.match.params.id});
  }
  renderAllMembers = ()=>{
    return this.state.allMembers.map((item)=> {
      return(
          <li style={{listStyleType:"none",marginTop:"1%"}} className="text-center"><img src={item.displayImage} className="img-fluid img-circle rounded"/> {item.username}</li>
      )
    });
  }
  privateMessage = (id) =>{
    socket.emit('userProfile',this.props.user);
  }
  addFriend = (id,from,user)=>{
    socket.emit('sendRequest',id,from,user);
  }
  spread = (to)=>{
    socket.emit('sendMessage',{to,from:this.props.user[0].username,msg:this.state.pmText});
    this.setState({pmText:" "})
  }
  renderPrivate = () =>{
    return this.state.privatemsg.map((item)=> <li style={{listStyleType:"none",backgroundColor:"white",padding:"5%",marginTop:"1%",boxShadow:"10px"}}>{item.from}:{item.msg}</li>)
  }
  render(){
    return(
      <div>
      <Navbar isClicked={(value)=>this.props.changeNotification({notify:value})}/>
      {this.props.notifications.length > 0 && this.props.notify ? <PendingRequest/> : ""}
      <div className="row">
        <div className="profile col-md-3">
            <div className="jumbotron" style={{marginTop:"5%"}}>
              <h4>{this.renderDetails()}</h4>
              <Link className="nav-link" to={`/profile/${this.props.user[0]._id}`} style={{display:"block",textAlign:"center"}} >View My Profile</Link>
            </div>
          <div className="jumbotron">
          <h3 className="text-center">Group Admin</h3>
          {this.renderAllMembers()}
          </div>
        </div>
        <div className="chat col-md-6" style={{marginTop:"5%"}}>
        <input className="form-control" placeholder="Write message " value={this.state.text} onChange={(e)=>this.setState({text:e.target.value})}></input>
        <button className="btn btn-primary btn-md float-right" style={{marginTop:"3%"}} onClick={this.submitMessage}>Enter Message</button>
        <div className="message-box" style={{overflowY: "auto",height: "75%"}}>
          {this.renderMessages()}
        </div>
        </div>
        <div className="col-md-3 members">
        <h3 className="text-center" style={{marginTop:"5%"}}>Online Users</h3>
        <ul className="jumbotron" style={{height:"50%",overflowY:"scroll"}}>{this.renderMembers()}</ul>
        <h3 className="text-center">Private Messages</h3>
        <div className="jumbotron" style={{height:"45%",overflowY:"scroll"}}>
        {this.renderPrivate()}
        </div>
        </div>
      </div>
      </div>
    )
  }
}
function mapStateToProps(state){
  console.log(state.notify);
  return {user:state.user,notifications:state.notifications,notify:state.notify}
}
export default connect(mapStateToProps,{getUser,addNotifications,changeNotification})(Members);

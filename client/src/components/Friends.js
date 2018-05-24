import React,{Component} from "react";
import axios from "axios";
import io from 'socket.io-client';
import {connect} from "react-redux";
import Navbar from "./Navbar";
import {onlineUsers} from "../actions";
import {Link} from 'react-router-dom';
const socket = io.connect('http://localhost:5000');

class Friends extends Component{
  constructor(props){
    super(props);
    this.state = {friends:[],members:[]}
  }
  componentWillMount(){
    axios.post('/api/getfriends',{id:this.props.match.params.id}).then(result=>{
      console.log("called",result.data)
      this.setState({friends:[...result.data[0].friends]})
    });
    axios.post('/api/getuser',{id:this.props.match.params.id}).then(result =>{
      console.log(result.data)
      this.setState({members:result.data[0]})
    });
  }
  renderAllMembers = () =>{
    if(this.state.friends.length < 1) return <h3>No friends</h3>
    return this.state.friends.map((item)=>{
      return (
        <div>
        <li style={{listStyleType:"none",marginTop:"5%"}}>{item.username}</li>
        <a href={`/profile/${item.name[0]}`}>Visit Profile</a>
        </div>
      )
    });
  }
  renderGroups = ()=>{
    return this.state.members.groups.map((item)=>{
    return( <div>
      <li style={{listStyleType:"none",marginTop:"5%"}}>{item.name}</li>
      <Link to={`/group/${item._id}`} >Explore Group</Link>
      </div>
    );
    })
  }

  render(){
    if(this.state.members.length < 1 || !this.state.members ) return <h3>Wait</h3>
    console.log(this.state.members[0])
    const {displayImage,username,groups,friends} = this.state.members;
    return(
      <div className="container-fluid">
      <Navbar/>
      <div className="jumbotron" style={{marginTop:"5%"}}>
      <h1 className="text-center">Profile Details</h1>
      <img src={displayImage} className="img-fluid img-thumbnail mx-auto" style={{display:"block",marginTop:"4%"}}/>
      <h3 className="text-center">{username}</h3>
      <div className="row" style={{marginTop:"5%"}}>
        <div className="col-md-2"/>
        <div className="col-md-4">
          <h2>My Groups</h2>
          {this.renderGroups()}
        </div>
        <div className="col-md-2"/>
        <div className="col-md-4">
          <h2>Friends</h2>
          {this.renderAllMembers()}
        </div>
      </div>
      </div>
      </div>
    )
  }
}
function mapStateToProps(state){
  return {online:state.online}
}
export default connect(mapStateToProps,{onlineUsers})(Friends);

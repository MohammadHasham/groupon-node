import React,{Component} from "react";
import Navbar from "./Navbar";
import Groups from "./Groups";
import io from 'socket.io-client';
import {connect} from "react-redux";
import {onlineUsers,changeNotification} from '../actions';
import PendingRequest from "./PendingRequest"
const socket = io.connect('http://localhost:5000');

class Home extends Component{
constructor(props){
  super(props);
}
componentWillMount(){
  socket.emit('onlineUsers',socket.id);
  socket.on('onlineUpdate',(data)=>{
    this.props.onlineUsers(data)
  });
}
  render(){
    return (
      <div>
      <Navbar isClicked={(value)=>this.props.changeNotification({notify:value})} search={true}/>
      {this.props.notifications.length > 0 && this.props.notify ? <PendingRequest/> : ""}
      <Groups />
      </div>
    );
  }
}
function mapStateToProps(state){
  return {notify:state.notify,notifications:state.notifications};
}
export default connect(mapStateToProps,{onlineUsers,changeNotification})(Home);

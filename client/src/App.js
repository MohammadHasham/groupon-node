import React, { Component } from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';
const socket = io.connect('http://localhost:5000');
class App extends Component {
  constructor(props){
    super(props);
    this.state = {onlineUsers:[],allGroups:['groupA','groupB','groupC']}
  }
  componentWillMount(){
    socket.on('connect',()=>{
      socket.emit('userProfile',{username:"user1",socketId:socket.id})
    });
    socket.on('updates',(data)=>{
      this.setState({onlineUsers:[...data]})
    });
    socket.on('reply',(data)=>{
      console.log(data);
    });
    socket.on('message',(data)=>{
      console.log(data);
    });
    socket.on('newRequest',(msg)=>{
      console.log(msg);
    });
  }
  sendMessage = (id)=>{
    socket.emit('sendMessage',id.socketId);
  }
  joinGroup = (name)=>{
    socket.emit('joinGroup',{groupName:name,username:'user'});
  }
  sendRequest = (item)=>{
    socket.emit('sendRequest',{name:'user',id:item.socketId});
  }
  render() {
    console.log(this.state)
    return (
      <div className="App">
        {this.state.onlineUsers.map((item)=> <li onClick={()=>this.sendMessage(item)}>{item.username}<button onClick={()=>this.sendRequest(item)}>Sned request</button></li>)}
        <h3>Group Chat</h3>
        {this.state.allGroups.map((item)=> <li onClick={()=>this.joinGroup(item)}>{item}</li>)}
      </div>
    );
  }
}

export default App;

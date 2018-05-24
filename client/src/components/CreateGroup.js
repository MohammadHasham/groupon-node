import React,{Component} from "react";
import Navbar from "./Navbar";
import axios from 'axios';
import {connect} from "react-redux";
import {creategrp,changeNotification} from '../actions';
import PendingRequest from "./PendingRequest";
class CreateGroup extends Component{
  constructor(props){
    super(props);
    this.state = {name:"",interest:"",img:""}
  }
  submitInfo = () =>{
    axios.post('/api/creategroup',{name:this.state.name,interest:this.state.interest,img:this.state.img}).then((result)=>{
      this.props.creategrp(result.data);
      alert("Group has been created");
    });
  }
  render(){
    return(
      <div className="container-fluid ">
      <Navbar isClicked={(value)=>this.props.changeNotification({notify:value})} />
      {this.props.notifications.length > 0 && this.props.notify ? <PendingRequest/> : ""}
      <h1 className="text-center" style={{marginTop:"5%"}}>Create a group</h1>
      <form>
        <div className="form-group">
          <label for="exampleInputEmail1">Group Name</label>
          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="Name" placeholder="Enter name" value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})}/>
          <small id="emailHelp" className="form-text text-muted">Enter Group Name.</small>
        </div>

        <div className="form-group">
          <label for="exampleInputEmail1">Interest</label>
          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="Name" placeholder="Interests" value={this.state.interest} onChange={(e)=>this.setState({interest:e.target.value})}/>
          <small id="emailHelp" className="form-text text-muted">Enter Interest.</small>
        </div>

        <div className="form-group">
          <label for="exampleInputEmail1">Enter Image URL</label>
          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="Name" placeholder="Enter image link" value={this.state.img} onChange={(e)=>this.setState({img:e.target.value})}/>
          <small id="emailHelp" className="form-text text-muted">Enter Image For Group.</small>
        </div>
     </form>
     <button className="btn btn-primary" onClick={this.submitInfo}>Submit Info</button>
      </div>
    )
  }
};
function mapStateToProps(state){
  return {notify:state.notify,notifications:state.notifications};
}
export default connect(mapStateToProps,{creategrp,changeNotification})(CreateGroup);

import React,{Component} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {deleteNotifications} from "../actions";
class PendingRequest extends Component{
  constructor(props){
    super(props);
  }
  accept = async (item,i) =>{
    const res = await axios.post('/api/acceptrequest',{username:item.from});
    this.reject(i);
  }
  reject = (id) =>{
    this.props.deleteNotifications(id);
  }
  render(){
    return this.props.arr.map((item,i)=>{
      return(
        <div key={i} className="jumbotron">
        <li>{item.message} : {item.user}</li>
        <button className="btn btn-primary btn-small" onClick={()=>this.accept(item,i)}>Accept</button>
        <button className="btn btn-primary btn-small" onClick={()=>this.reject(i)}>Reject</button>
        </div>
      )
    });
  }
}
function mapStateToProps(state){
  return {arr:state.notifications};
}
export default connect(mapStateToProps,{deleteNotifications})(PendingRequest);

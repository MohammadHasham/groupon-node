import React,{Component} from "react";
import axios from "axios";
import {getGroups,filtergroups} from "../actions";
import {connect} from "react-redux";
class Groups extends Component{
  constructor(props){
    super(props)
    this.state = {intertext:""}
  }
  componentWillMount(){
    this.props.getGroups();

  }
  renderGroups = ()=>{
    return this.props.groups.map((item)=>{
      return (<div className="col-md-4 m-1  card" >
        <div className="card-body" style={{margin:"1% 0% 0% 1%"}}>
          <h5 className="card-title">{item.name}</h5>
          <p>{item.interest}</p>
          <img src={item.img} className="img-fluid img-thumbnail rounded"/>
          <a href={`/group/${item._id}`} className="btn btn-primary">Explore Group</a>
        </div>
      </div>
    );
    });
  }
  submit = ()=>{
    this.props.filtergroups(this.state.intertext);
  }
  render(){
    return(
      <div className="container-fluid">
      <div className="row" style={{marginTop:"3%"}}>
        <div className="col-md-3">
          <div className="jumbotron">
          <h3 className="text-center interest">Filter By Interests</h3>
          <div className="row text-center">
          <div className="col-12">
          <input className="form-control" type="text" value={this.state.intertext} onChange={(e)=>this.setState({intertext:e.target.value})}/>
          <button className="btn btn-primary btn-md text-center" onClick={this.submit} style={{marginTop:"3%"}}>Submit</button>
          </div>
          </div>
          </div>
        </div>
        <div className="col-md-8">
        <div className="row" style={{marginLeft:"10%"}}>
      {this.renderGroups()}
      </div>
      </div>
      </div>
      </div>
    )
  }
}
function mapStateToProps(state){
  console.log(state);
 return {groups: state.groups}
}
export default connect(mapStateToProps,{getGroups,filtergroups})(Groups);

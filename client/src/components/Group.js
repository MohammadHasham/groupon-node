import React,{Component} from "react";
import Navbar from "./Navbar";
import Post from "./Post";
import {createPost,getPosts,like,dislike,getGroups,changeNotification} from "../actions";
import {connect} from "react-redux";
import PendingRequest from "./PendingRequest"
class Group extends Component{
  constructor(props){
    super(props);
    this.state = {text:"",name:"",image:""}
  }
  componentWillMount(){
    this.props.getPosts(this.props.match.params.id);
  }
  createPost = () =>{
    const {text,name,image} = this.state;
    this.props.createPost(name,image,text,this.props.match.params.id);
    this.props.getGroups(this.props.match.params.id);
  }
  renderPosts = () =>{
    return this.props.posts.map((item)=>{
      return <Post details={item} style={{marginTop:"3%"}}/>
    });
  }
  render(){
    return (
      <div className="container-fluid">
      <Navbar isClicked={(value)=>this.props.changeNotification({notify:value})} isGroup={true} id={this.props.match.params.id}/>
      {this.props.notifications.length > 0 && this.props.notify ? <PendingRequest/> : ""}
      <div className="jumbotron" style={{marginTop:"3%"}}>
      <div className="container-fluid" style={{marginTop:"1%"}}>
      <div className="form-group">
          <label >Enter Title</label>
          <input className="form-control" name="title" placeholder="Enter Title" onChange={(e)=>this.setState({name:e.target.value})}/>
          <label >Enter Image</label>
          <input className="form-control" placeholder="Enter Image" onChange={(e)=>this.setState({image:e.target.value})}/>
          <label >Post Here</label>
          <textarea name="post" className="form-control" placeholder="Post here . . . "
          id="exampleFormControlTextarea1" rows="3" onChange={(e)=>this.setState({text:e.target.value})}></textarea>
          <button onClick={this.createPost} className="btn btn-primary btn-md float-right" style={{marginTop:"1%",marginBottom:"3%"}}>Create Post</button>
      </div>
      </div>
      </div>
      {this.renderPosts()}
      </div>
    )
  }
};
function mapStateToProps(state){
  console.log(state);
  return {posts:state.posts,groups:state.groups,notify:state.notify,notifications:state.notifications}
}
export default connect(mapStateToProps,{createPost,getPosts,like,dislike,getGroups,changeNotification})(Group);

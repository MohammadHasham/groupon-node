import React,{Component} from "react";
import {like,dislike} from "../actions";
import CommentsDisplay from './CommentsDisplay';
import axios from 'axios';
import {connect} from "react-redux";
class Post extends Component{
  constructor(props){
    super(props);
    this.state = {like:false,showComments:false,comments:[],text:''}
  }
  like = (id)=>{
    this.props.like(id)
  }
  dislike = (id) =>{
    this.props.dislike(id);
  }
  renderComments = async (id)=>{
    this.setState({showComments:!this.state.showComments})
      const res = await axios.post('/api/getcomments',{id});
      this.setState({comments:res.data[0].comments})
  }
  renderCms = () =>{
    return this.state.comments.map((item)=> <div><h4 className="card card-body bg-light">{item.comment}</h4><span>{item.postedBy}</span></div>);
  }
  addComment = async (text,id)=>{
    const res = await axios.post('/api/post/comment',{text,id});
    this.setState({comments:[...this.state.comments,res.data]})
  }
  render(){
    const {postAdmin,postContent,likeCount,Comments,postName,_id,image} =  this.props.details;
    return (
      <div className="col-md-12 m-1  card" >
      <h5 className="card-title">{postName}</h5>
        <div className="card-body" style={{margin:"1% 0% 0% 1%"}}>

          <img src={image} className="img-fluid img-thumbnail rounded"/>
          <p>{postContent}</p>
          <p>Published by {postAdmin}</p>
          <div className="row" style={{marginTop:"3%"}}>
            <div className="col-md-4">
              <button className="btn btn-primary" onClick={()=>this.like(_id)}>Like</button>
              <span style={{marginLeft:"3%"}}>{likeCount}</span>
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary" onClick={()=>this.dislike(_id)}>Dislike</button>
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary" id="comment" onClick={()=>this.renderComments(_id)}>Show Comments</button>
            </div>
          </div>
          <input className="form-control" name="commentadd" placeholder="Add Comment" style={{marginTop:"4%"}} onChange={(e)=>this.setState({text:e.target.value})}/>
          <button className="btn btn-primary btn-md" style={{marginTop:"3%"}} onClick={()=>this.addComment(this.state.text,_id)}>Add Comment</button>
          <div className="row">
            <ul className="text-center mx-auto">{this.state.showComments ? this.renderCms():""}</ul>
          </div>
        </div>
      </div>
    )
  }
};

export default connect(null,{like,dislike})(Post);

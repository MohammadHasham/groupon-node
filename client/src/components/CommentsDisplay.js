import React,{Component} from "react";

import {connect} from "react-redux";
class CommentsDisplay extends Component{
  constructor(props){
    super(props);
    this.state={text:""}
  }
  componentWillMount(){
    this.props.getComments(this.props.id);
  }
  renderComments = ()=>{
    return this.props.comments.map((item)=> <div><h4 className="card card-body bg-light">{item.comment}</h4><span>{item.postedBy}</span></div>);
  }
  render(){
    return (
      <div className="jumbotron" style={{width:"100%"}}>
        <input className="form-control" placeholder="Add Comment" onChange={(e)=>this.setState({text:e.target.value})}/>
        <button className="btn btn-primary btn-md" style={{marginTop:"3%"}} onClick={()=>this.props.addComment(this.state.text,this.props.id)}>Add Comment</button>
        <div className="row display">
          <ul className="text-center mx-auto">{this.renderComments()}</ul>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state){
  console.log(state.comments)
  return {comments:state.comments};
}
export default connect(mapStateToProps,null)(CommentsDisplay);

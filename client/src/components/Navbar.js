import React,{Component} from "react";
import {DebounceInput} from 'react-debounce-input';
import {searchGroups,getUser} from '../actions';
import {connect} from "react-redux";
import {Link} from "react-router-dom"
class Navbar extends Component{
  constructor(props){
    super(props);
    this.state = {search:"",user:"",notify:false}
  }
  componentWillMount(){
    this.props.getUser();
  }
  searchQuery = (e)=>{
    this.setState({search:e.target.value});
    this.props.searchGroups(e.target.value);
  }
  change = ()=>{
    if(!this.props.isClicked) return ;
    this.setState({notify:!this.state.notify})
    this.props.isClicked(!this.state.notify);
  }
  render(){
  if(!this.props.user[0]) return "Login Please Component"
  return(
    <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Groupon</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
      </li>
      {this.props.isGroup ? <li className="nav-item">
        <Link className="nav-link" id="members" to={`/members/${this.props.id}`}>Members</Link>
      </li> : "" }
      <li className="nav-item" id="creategroup">
        <Link className="nav-link" to={`/creategroup`}>Create Group</Link>
      </li>
      <li className="nav-item">
        <a className="nav-link" onClick={this.change}>Notifications <span className="alert alert-danger" >{this.props.notifications ? this.props.notifications.length:""}</span></a>
      </li>
    </ul>
    {this.props.search ? <form className="form-inline my-2 my-lg-0">
    <DebounceInput
          className="form-control mr-sm-2"
          minLength={1}
          debounceTimeout={500}
          placeholder="Search"
          onChange={this.searchQuery} />
    </form> : ""}
    <ul className="navbar-nav ml-auto">
      <li className="nav-item active profile">
        <Link className="nav-link" id="profile" to={`/profile/${this.props.user[0]._id}`}>
        <img src={this.props.user.length>0 ?this.props.user[0].displayImage:""} className="rounded-circle" style={{width:"30px",marginRight:"3px"}}/>
        {this.props.user.length>0 ? <span className="user">{this.props.user[0].username}</span>:""}
        </Link>
      </li>
    </ul>

  </div>
</nav>
</div>
);
}
}
function mapStateToProps(state){
  return {user:state.user,notifications:state.notifications}
}
export default connect(mapStateToProps,{searchGroups,getUser})(Navbar);

import React,{Component} from "react";
import Home from "./Home";
import Group from "./Group";
import Friends from "./Friends";
import Members from "./Members";
import CreateGroup from "./CreateGroup";
import { BrowserRouter, Route } from 'react-router-dom';

class Main extends Component{
  render(){
    return (
      <div className="container-fluid">
      <BrowserRouter>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/group/:id" component={Group}/>
            <Route path="/profile/:id" component={Friends}/>
            <Route path="/members/:id" component={Members}/>
            <Route path="/creategroup" component={CreateGroup}/>
          </div>
      </BrowserRouter>
      </div>
    );
  }
}
export default Main;

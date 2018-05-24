import {combineReducers} from "redux";
import getGroups from "./getGroups";
import getUser from "./getUser";
import createPost from "./createPost";
import Comments from "./Comments";
import online from "./onlineUsers"
import notifications from "./notifications";
import notify from "./notify";
const rootReducer = combineReducers({
  groups:getGroups,
  user:getUser,
  posts:createPost,
  comments:Comments,
  online:online,
  notifications:notifications,
  notify:notify
});

export default rootReducer;

import {ONLINE_USERS} from "../actions/types";

export default function(state = [],action){
  switch(action.type){
    case ONLINE_USERS:
      return action.payload
    default:
    return state;
  }
}

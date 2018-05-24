import {GET_GROUPS,SEARCH_GROUPS,LIKE,CREATE_GROUP} from "../actions/types";

export default function(state = [],action){
  switch(action.type){
    case GET_GROUPS:
      return action.payload;
    case SEARCH_GROUPS:
      console.log("action.payload");
      return action.payload;
    case CREATE_GROUP:
      return action.payload
    default:
    return state;
  }
}

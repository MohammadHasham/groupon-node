import {GET_COMMENTS,NEW_COMMENT} from "../actions/types";

export default function(state = [],action){
  switch(action.type){
    case GET_COMMENTS:
      return action.payload[0].comments;
    case NEW_COMMENT:
      return [...state,...action.payload];
    default:
    return state;
  }
}

import {GET_USER} from "../actions/types";

export default function(state = "",action){
  switch(action.type){
    case GET_USER:
    console.log('i am called',action);
      return action.payload;
    default:
    return state;
  }
}

import {ADD_NOTIFICATIONS,DELETE_NOTIFICATIONS} from "../actions/types";

export default function(state = [],action){
  switch(action.type){
    case ADD_NOTIFICATIONS:
      return [...state,action.payload];
    case DELETE_NOTIFICATIONS:
     state.splice(action.payload.id,1);
     return state;
    default:
    return state;
  }
}

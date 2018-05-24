import {CHANGE_NOTIFY} from "../actions/types";

export default function(state = false,action){
  switch(action.type){
    case CHANGE_NOTIFY:
      state = !state;
      return state;
    default:
    return state;
  }
}

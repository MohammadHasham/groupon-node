import {CREATE_POST,GET_POSTS,LIKE} from "../actions/types";

export default function(state = [],action){
  switch(action.type){
    case CREATE_POST:
      return [...state,action.payload];
    case GET_POSTS:
      return [...state,...action.payload]
      case LIKE:
       console.log(state);
       console.log(action.payload)
        state.forEach((item,i)=>{
          if(item._id == action.payload._id){
              state[i] = action.payload;
          }
        });
        return [...state];
    default:
    return state;
  }
}

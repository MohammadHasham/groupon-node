import axios from 'axios';
import {GET_GROUPS,SEARCH_GROUPS,GET_USER,CREATE_POST,LIKE,DISLIKE,GET_COMMENTS,NEW_COMMENT,GET_POSTS,ONLINE_USERS,
  CREATE_GROUP,ADD_NOTIFICATIONS,DELETE_NOTIFICATIONS,CHANGE_NOTIFY} from "./types";

export const getGroups =(id)=> async dispatch =>{
  const res = await axios.get('/api/getgroups',{id});
  dispatch({type:GET_GROUPS,payload:res.data});
}
export const getPosts =(id)=> async dispatch =>{
  const res = await axios.post('/api/getposts',{id});
  dispatch({type:GET_POSTS,payload:res.data[0].posts});
}
export const searchGroups =(name) => async dispatch =>{
  const res = await axios.post('/api/filter/query',{name});
  console.log(res.data);
  dispatch({type:SEARCH_GROUPS,payload:res.data});
}
export const getUser = () =>async dispatch =>{
  const res = await axios.get('/api/getuser');
  dispatch({type:GET_USER,payload:res.data})
}
export const createPost = (postName,image,content,id) =>async dispatch=>{
  const res = await axios.post('/api/createpost',{postName,image,content,id});
  dispatch({type:CREATE_POST,payload:res.data});
}
export const like = (id) => async dispatch =>{
  const res = await axios.post('/api/post/like',{id});
  dispatch({type:LIKE,payload:res.data})
}
export const dislike = (id) => async dispatch =>{
  const res = await axios.post('/api/post/dislike',{id});
  dispatch({type:LIKE,payload:res.data})
}
export const onlineUsers = (data) => {
  console.log(data);
  return {type:ONLINE_USERS,payload:data};
}
export const creategrp = (data) =>{
  return {type:CREATE_GROUP,payload:data}
}
export const filtergroups =(text) => async dispatch =>{
  const res = await axios.post('/api/filter',{interest:text});
  dispatch({type:SEARCH_GROUPS,payload:res.data});
}
export const addNotifications = (data) =>{
  return {type:ADD_NOTIFICATIONS,payload:data}
}
export const deleteNotifications = (id,data) =>{
  return {type:DELETE_NOTIFICATIONS,payload:{data,id}}
}
export const changeNotification = (id,data) =>{
  return {type:CHANGE_NOTIFY}
}

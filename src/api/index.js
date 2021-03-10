import {get, post } from './http';

/* =======================用户相关函数====================== */
//判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`, params);

//查询用户
export const getAllUser = () => get(`/user/getAllUser`);

//添加用户
export const setUser = (params) => post(`/user/add`, params);

//修改用户
export const updateUser = (params) => post(`/user/update`, params);

//删除用户 
export const deleteUser = (id) => get(`/user/delete?id=${id}`);

/* =======================景区动态相关函数====================== */

//获取信息
export const getSceneryByUserId = (userId) => get(`/sceneryshare/user/scenery?userId=${userId}`);

//删除记录
export const deleteScenery = (id) => get(`/sceneryshare/delete?id=${id}`);

/* =======================随拍动态相关函数====================== */

//获取信息
export const getCasualByUserId = (userId) => get(`/casualshare/user/casual?userId=${userId}`);

//删除记录
export const deleteCasual = (id) => get(`/casualshare/delete?id=${id}`);
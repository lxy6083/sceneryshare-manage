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

//切换用户是否被锁定
export const isLocked = (flag, id) => get(`/user/toggleFlag?flag=${flag}&id=${id}`);

//通过用户id查询相关信息
export const getByPrimaryKey = (id) => get(`/user/getByPrimaryKey?id=${id}`);

/* =======================动态相关函数====================== */

//获取信息
export const getShareByUserId = (userId) => get(`/sceneryshare/user/scenery?userId=${userId}`);

//删除记录
export const deleteShare = (id) => get(`/sceneryshare/delete?id=${id}`);

//设置/取消精华
export const toggleEssence = (essence, id) => get(`/sceneryshare/toggleEssence?essence=${essence}&id=${id}`);

//获取所有的动态
export const getAllShare = () => get(`/sceneryshare/getAllSceneryShare`);

//通过用户id获取总动态数
export const getCountByUserId = (userId) => get(`/sceneryshare/getCountByUserId?userId=${userId}`);

//设置是否可见
export const toggleVisible = (visible, id) => get(`/sceneryshare/toggleVisible?visible=${visible}&id=${id}`);

//修改动态属性
export const updateShare = (params) => post(`/sceneryshare/update`, params);

/* =======================景区相关函数====================== */

//获取所有的景区信息
export const getAllScenery = () => get(`/scenery/getAllScenery`);

//删除景点
export const deleteScenery = (id) => get(`/scenery/delete?id=${id}`);

//切换景点是否可用
export const toggleFlag = (flag, id) => get(`/scenery/toggleFlag?flag=${flag}&id=${id}`);

//获取一级景点
export const getFirstScenery = () => get(`/scenery/getFirstScenery`);

//修改景点类型
export const updateType = (type,id) => get(`/scenery/updateType?type=${type}&id=${id}`);

//修改父景点id
export const updateParentId = (parentId,id) => get(`/scenery/updateParentId?parentId=${parentId}&id=${id}`);

//通过主键获取景点信息
export const getSceneryById = (id) => get(`/scenery/getByPrimaryKey?id=${id}`);

/* =======================意见反馈相关函数====================== */

//获取意见反馈列表
export const getAllFeedback = () => get(`/feedback/getAllFeedback`);

//回复意见
export const reply = (params) => post(`/feedback/reply`, params);

/* =======================信息统计相关函数====================== */

//最近七天新增数据
export const getLatestWeekNew = () => get(`/info/getLatestWeekNew`);

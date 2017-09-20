/**
 * Created by kwx on 2017/8/18.
 */
import {
    createAjaxAction,
} from '../utils'

import * as ajaxFun from '../utils/ajax'
//获取用户详情
export const getUserMessage = createAjaxAction(ajaxFun.fetchJSONByPost('/user/userInfo'));
//更新用户信息
export const updateUserMessage = createAjaxAction(ajaxFun.fetchJSONByPost('/user/updateUserInfo'));
//更新密码
export const updateUserPwd = createAjaxAction(ajaxFun.fetchJSONByPost('/user/updateUserPsw'));
//用户列表
export const getUserList = createAjaxAction(ajaxFun.fetchJSONByPost('/user/userLists'));
//删除用户
export const deleteUsers = createAjaxAction(ajaxFun.fetchJSONByPost('/user/deleteUser'));
//踢出用户
export const forbidUserById = createAjaxAction(ajaxFun.fetchJSONByPost('/user/forbidUserById'));
//激活用户
export const activeUserById = createAjaxAction(ajaxFun.fetchJSONByPost('/user/activeUserById'));
//在线用户列表
export const getOnlineUserList = createAjaxAction(ajaxFun.fetchJSONByPost('/user/onlineUsers'));
//踢出登陆
export const shotOffOnlineUser = createAjaxAction(ajaxFun.fetchJSONByPost('/user/shotOffOnlineUser'));
//查询用户角色
export const myPermission = createAjaxAction(ajaxFun.fetchJSONByPost('/role/myPermission'));
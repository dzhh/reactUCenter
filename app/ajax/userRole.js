/**
 * Created by kwx on 2017/8/30.
 */

import {
    createAjaxAction,
} from '../utils'

import * as ajaxFun from '../utils/ajax'
//查询用户角色
export const selectRoleByUserId = createAjaxAction(ajaxFun.fetchJSONByPost('/userRole/selectRoleByUserId'));
//角色列表
export const roleList = createAjaxAction(ajaxFun.fetchJSONByPost('/role/roleLists'));

export const deleteRole = createAjaxAction(ajaxFun.fetchJSONByPost('/role/deleteRole'));

export const addRole = createAjaxAction(ajaxFun.fetchJSONByPost('/role/addRole'));

export const testPer = createAjaxAction(ajaxFun.fetchJSONByPost('/permission/deleteMenu'));

export const permissionList = createAjaxAction(ajaxFun.fetchJSONByPost('/permission/permissionLists'));

export const deletePermission = createAjaxAction(ajaxFun.fetchJSONByPost('/permission/deletePermission'));
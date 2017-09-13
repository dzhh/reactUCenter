/**
 * Created by kwx on 2017/9/13.
 */
import {
    createAjaxAction,
} from '../utils'

import * as ajaxFun from '../utils/ajax'

export const rolePermissionAllocation = createAjaxAction(ajaxFun.fetchJSONByPost('/rolePermission/rolePermissionAllocation'));

export const selectPermissionByRoleId = createAjaxAction(ajaxFun.fetchJSONByPost('/rolePermission/selectPermissionByRoleId'));
export const addPermission2Role = createAjaxAction(ajaxFun.fetchJSONByPost('/rolePermission/addPermission2Role'));


export const clearPermissionByRoleIds = createAjaxAction(ajaxFun.fetchJSONByPost('/rolePermission/clearPermissionByRoleIds'));



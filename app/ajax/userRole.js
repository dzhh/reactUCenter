/**
 * Created by kwx on 2017/8/30.
 */

import {
    createAjaxAction,
} from '../utils'

import * as ajaxFun from '../utils/ajax'

export const selectRoleByUserId = createAjaxAction(ajaxFun.fetchJSONByPost('/userRole/selectRoleByUserId'));
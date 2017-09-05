/**
 * Created by kwx on 2017/8/18.
 */
import {
    createAjaxAction,
} from '../utils'

import * as ajaxFun from '../utils/ajax'

export const getUserMessage = createAjaxAction(ajaxFun.fetchJSONByPost('/user/userInfo'));
export const updateUserMessage = createAjaxAction(ajaxFun.fetchJSONByPost('/user/updateUserInfo'));

export const updateUserPwd = createAjaxAction(ajaxFun.fetchJSONByPost('/user/updateUserPsw'));
export const getUserList = createAjaxAction(ajaxFun.fetchJSONByPost('/user/userLists'));
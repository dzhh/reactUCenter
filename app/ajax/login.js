import {
  createAjaxAction,
} from '../utils'

import * as ajaxFun from '../utils/ajax'

export const fetchLogin = createAjaxAction(ajaxFun.fetchJSONByPost('/user/login'));




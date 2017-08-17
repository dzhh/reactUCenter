import {
  createAjaxAction,
} from '../utils'

import { ajax } from '../utils'


export const fetchLogin = createAjaxAction(ajax.fetchJSONByPost('/user/login'));




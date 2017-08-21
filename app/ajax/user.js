/**
 * Created by kwx on 2017/8/18.
 */
import {
    createAjaxAction,
} from '../utils'

import { ajax } from '../utils'

export const getUserMessage = createAjaxAction(ajax.fetchJSONByPost('/user/userInfo'));





import {
  createAction,
} from 'redux-actions'
import {
  common,
  login,
} from '../api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from '../utils'

// export const fetchLogin = createAction('request login');
export const requestLogin = createAction('request login')
export const receiveLogin = createAction('receive login')

export const fetchLogin = createAjaxAction(login.login, requestLogin, receiveLogin);


export const requestAmList = createAction('request am list')
export const recevieAmList = createAction('receive am list')
export const fetchAmList = createAjaxAction(common.amList, requestAmList, recevieAmList)
export const resetAmList = createAction('reset am list')

// export function fetchLogin(values,res,res1,res2) {
//     alert(values.username);
//     //console.log(values);
//    // console.log(res1);
//
//     return action
// }

// export const requestAmList = createAction('request am list')
// export const recevieAmList = createAction('receive am list')
// export const fetchAmList = createAjaxAction(common.amList, requestAmList, recevieAmList)
// export const resetAmList = createAction('reset am list')


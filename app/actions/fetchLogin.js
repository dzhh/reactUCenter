import {
  createAction,
} from 'redux-actions'
import {
  common,
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'


export function fetchLogin(values,res,res1,res2) {
    alert(values.username);
    //console.log(values);
   // console.log(res1);
}

// export const requestAmList = createAction('request am list')
// export const recevieAmList = createAction('receive am list')
// export const fetchAmList = createAjaxAction(common.amList, requestAmList, recevieAmList)
// export const resetAmList = createAction('reset am list')


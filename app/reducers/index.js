import {
  routerReducer as routing,
} from 'react-router-redux'
import {
  combineReducers,
} from 'redux'

import tabListResult from './tabList'

// house
import {
  houseCheckSearchResult,
  houseCheckSearchQuery,
  houseDetailResult,
} from './house'

import {
  loginResponse,
} from './login'

//其实也是一个reducer，它接受整个state和一个action，
// 然后将整个state拆分发送给对应的reducer进行处理，所有的reducer会收到相同的action
const rootReducer = combineReducers({
  routing,
  config: (state = {}) => state,
  tabListResult,

  loginResponse,

  houseCheckSearchResult,
  houseCheckSearchQuery,
  houseDetailResult,


});

export default rootReducer;

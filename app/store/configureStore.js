
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { logger, router, reduxRouterMiddleware } from '../middleware'
import rootReducer from '../reducers'

const nextReducer = require('../reducers')

export default function configure(initialState) {
  // console.log('initialState', initialState)
    //createStore 创建一个state用来存储状态树
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  //applyMiddleware:  调度中间件来增强store，例如中间件redux-thunk等
  const createStoreWithMiddleware = applyMiddleware(
    reduxRouterMiddleware,
    thunkMiddleware,
    logger,
    router
  )(create)
   //创建store 第一个参数reducers
  const store = createStoreWithMiddleware(rootReducer, initialState)


    //热更新配置
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

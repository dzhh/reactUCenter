import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
//利用react-router-redux提供的syncHistoryWithStore 可以结合store同步导航事件
import { syncHistoryWithStore } from 'react-router-redux'

import routes from './routes';
import configure from './store/configureStore';
import myhistory from './history'
//const 声明一个只读的常量，值不可变；var 声明一个全局变量，值可变
const store = configure({ config: global.$GLOBALCONFIG })
//创建一个hashHistory，路由的切换由URL的hash变化决定，即URL的#部分发生变化 加强版history
const history = syncHistoryWithStore(myhistory, store)

// history.listen(location => console.log('location:', location))
//// 监听当前的地址变换
history.listen(function (location) { return location })


ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
        {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);

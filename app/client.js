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


// Route则对路由地址和组件进行绑定，Route具有嵌套功能，表示路由地址的包涵关系，
// 这和组件之间的嵌套并没有直接联系。Route可以向绑定的组件传递7个属性：
// children，history，location，params，route，routeParams，routes，每个属性都包涵路由的相关的信息。
ReactDOM.render(
    //react 和 redux 绑定
  <Provider store={store}>
    <Router history={history} >
        {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);

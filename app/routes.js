import React from 'react'
import {
  Route,
  IndexRoute
} from 'react-router'
import App from './containers/App'
import Welcome from './pages/welcome'
// import Login from './containers/App/login'

// import {
//   houseCheck,
//   houseManage,
//   houseDetail,
//   roomDetail,
// } from './pages/house'

// import popCheck from './pages/pop/index'

const houseManage = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./pages/house/houseManage').default)
  }, 'houseManage')
}


const Login = (location, cb) => {
    //require.ensure这个函数是一个代码分离的分割线，表示 回调里面的require
    //是我们想要进行分割出去的，即require(’./containers/App/login’)，把login分割出去，形成一个
    //webpack打包的单独js文件 [] 中为需要的依赖
  require.ensure([], require => {
    cb(null, require('./containers/App/login').default)
  }, 'login')
}


const test = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./pages/test').default)
  }, 'test')
}

/* 进入路由的判断*/
function isLogin(nextState, replaceState) {
  const token = sessionStorage.getItem('token')
  if (!token) {
    //用于替换当前的 URL，并且会将被替换的 URL 在浏览器历史中删除。
     // 函数的第一个参数是 state 对象，第二个是路径 replaceState(null,url);
    replaceState('/login')
      // hashHistory.push('/login')
  }
}

//children（以路由的包涵关系为区分的组件）
//location（包括地址，参数，地址切换方式，key值，hash值）
const routes = (
  <Route>
     /*onEnter当路由进入即触发 子路由进入父路由不会触发*/
    <Route path="/" component={App} onEnter={isLogin}>
      <IndexRoute component={Welcome} />
      <Route path="/houseManage" getComponent={houseManage} />
      <Route path="/test" getComponent={test} query={{'name': 'dupi'}} />
    </Route>
    <Route path="/login" getComponent={Login}></Route>
  </Route>
);

export default routes

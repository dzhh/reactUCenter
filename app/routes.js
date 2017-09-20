import React from 'react'
import {
    Route,
    IndexRoute
} from 'react-router'
import App from './containers/App'
import Welcome from './pages/welcome'
import Homepage from './pages/homepage/index'
import UpdateUserMseeage from './pages/homepage/update_user_message'
import UpdateUserPassword from './pages/homepage/update_password'
import MyPermissions from './pages/homepage/my_permissions'
import Register from './pages/register/register'
//import Login from './containers/App/login'

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

const homePage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/homepage/index').default)
    }, 'homePage')
}
const updateUserMessage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/homepage/update_user_message').default)
    }, 'update_user_message')
}
const updatePassword = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/homepage/update_password').default)
    }, 'update_password')
}
const myPermissions = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/homepage/my_permissions').default)
    }, 'my_permissions')
}
const menuList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/menu/menu_list').default)
    }, 'menu_list')
}
const userList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/user/user_list').default)
    }, 'user_list')
}
const roleList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/permission/role_list').default)
    }, 'role_list')
}
const onlineUser = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/user/online_user').default)
    }, 'online_user')
}
const roleAllocation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/permission/role_allocation').default)
    }, 'role_allocation')
}
const permissionList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/permission/permission_list').default)
    }, 'permission_list')
}
const permissionAllocation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./pages/permission/permission_allocation').default)
    }, 'permission_allocation')
}
// const Register = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('./pages/register/register').default)
//     }, 'registe')
// }
/* 进入路由的判断*/
function isLogin(nextState, replaceState) {
    const token = sessionStorage.getItem('token')
    if (!token) {
        //用于替换当前的 URL，并且会将被替换的 URL 在浏览器历史中删除。
        // 函数的第一个参数是 state 对象，第二个是路径 replaceState(null,url);
       // console.log(nextState)
        console.log("前缀是"+nextState.location.pathname);
        if(nextState.location.pathname == "/") {
            replaceState('/login')
        }
        if(nextState.location.pathname == "/register") {
            replaceState('/register')
        }


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
            {/*<Route path="/homePage" getComponent={homePage} />*/}
            <Route path="/user/userInfo" getComponent={homePage} />
            <Route path="/user/updateUserInfo" getComponent={updateUserMessage} />
            <Route path="/user/updateUserPsw" getComponent={updatePassword} />
            <Route path="/user/myPermission" getComponent={myPermissions} />
            <Route path="/menu/menuLists" getComponent={menuList} />
            <Route path="/user/userLists" getComponent={userList} />
            <Route path="/role/roleLists" getComponent={roleList} />
            <Route path="/user/onlineUsers" getComponent={onlineUser} />
            <Route path="/role/allocationLists" getComponent={roleAllocation} />
            <Route path="/permission/permissionLists" getComponent={permissionList} />
            <Route path="/permission/rolePermissionAllocation" getComponent={permissionAllocation} />
        </Route>
        <Route path="/login" getComponent={Login}></Route>
        <Route path="/register" component={Register}></Route>
    </Route>
);

export default routes
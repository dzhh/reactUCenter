
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { message } from 'antd'

import Header from './header'
import Footer from './footer'
import LeftNav from './leftNav'
import RightAside from './rightAside'
import TabList from './tabList'
import Extra from './extra'
import 'antd/dist/antd.less'
import '../../style/base.less'
import { getUserMessage } from '../../ajax/user'
//connect 会把State和dispatch转换成props传递给子组件
//bindActionCreators的作用是将一个或多个action和dispatch
// 组合起来生成mapDispatchToProps需要生成的内容
@connect(
    (state, props) => ({}),
    (dispatch) => ({ actions: bindActionCreators({}, dispatch) })
)
//react class
export default class App extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    //State是整个应用的数据，本质上是一个普通对象。
    this.state = {
      pageHeight: 0,
      isLeftNavMini: false,   // 左侧导航菜单是否mini模式
      ucUser:{}
    }
    let test = this.props
    //
    this.isLeftNavMini = this.isLeftNavMini.bind(this)
  }

  // 组件已经加载到dom中
    //组件渲染之后调用，可以通过this.getDOMNode()获取和操作dom节点，只调用一次。
  componentDidMount() {
    // antd的message组件 的全局配置
    message.config({
      duration: 3,
    })
  }
//组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state。
  componentWillMount() {
    // 初始化左侧菜单是mini模式还是正常模式
    if (sessionStorage.getItem('isLeftNavMini') == 'false') {
      this.setState({
        isLeftNavMini: false,
      })
    } else {
      this.setState({
        isLeftNavMini: true,
      })
    }
    //新增 第一次加载时获取用户信息
    //   const user={};
      //   user.userName = sessionStorage.getItem('userName')
      //   user.userId = sessionStorage.getItem('userId')
      //   console.log(user.userName+"加载之前----------"+user.userId);
      //
      //   getUserMessage(user, (res) => {
      //       console.log("++++++"+res);
      //       if (res.ospState == 200) {
      //           this.setState({ucUser: res.data.ucUser})
      //       } else {
      //           message.warning(res.msg)
      //       }
      //   })
  }

  // 左侧是否mini
  isLeftNavMini(val) {
    this.setState({
      isLeftNavMini: val,
    }, () => {
      sessionStorage.setItem('isLeftNavMini', val)
    })
  }
//react最重要的步骤，创建虚拟dom，进行diff算法，更新dom树都在此进行。此时就不能更改state了。
  render() {
    const { location, children } = this.props
    return (
      <div id="container" className="effect easeInOutBack mainnav-lg aside-bright">
        <Header />
        <div className="boxed">
          <div className={this.state.isLeftNavMini ? 'boxed boxed-mini' : 'boxed'}>
            <div id="content-container" className="content-container">
              <div id="page-content">
                <TabList />
                {children}
              </div>
            </div>
          </div>
          <LeftNav
            location={location}
            leftNavMode={this.isLeftNavMini}
          />
          <RightAside />
        </div>
        <Footer />
        <Extra />
      </div>
    )
  }
}


import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { Checkbox,Spin, message, Form, Icon, Input, Button, Row, Col } from 'antd'
// import { fetchLogin, receiveLogin } from '../../actions/login'
import { fetchLogin } from '../../ajax/login'
import imgUrlWeb from '../../images/leftBg.jpg'
import { routerActions } from 'react-router-redux'
import '../../style/login.less'
import {changeLogout } from '../../actions/login'
import { deleteAllTab } from '../../actions/tabList'

import {
     logOut
} from '../../utils'
const FormItem = Form.Item
var webStyle = {
    // backgroundImage: `url(${imgUrlWeb})`
    width: "100%",
    height: "100%",
    backgroundImage: "url('"+imgUrlWeb+"')"
};
//连接 Redux 的组件 不可复用
@connect(
  (state, props) => ({
    config: state.config,
    loginResponse: state.loginResponse,
    logout:state.logout,
  }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch),
        dispatch: dispatch })
)
//测试为 在每输入一个字符时调用
@Form.create({
  onFieldsChange(props, items) {
    // console.log(items)
    // props.cacheSearch(items);
  },
})

export default class Login extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      //为true时  登陆页面一直加载
      loading: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.checkPass = this.checkPass.bind(this)
    this.checkName = this.checkName.bind(this)
    this.noop = this.noop.bind(this)
  }
    componentWillMount() {
        const {dispatch} = this.props
        dispatch(deleteAllTab());
      //  dispatch(changeLogout())
    }
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.state.loading = true
         this.setState({loading: true})
        const re={} ;
        Object.keys(values).map((key) => values[key] = (
            values[key] && typeof(values[key]) =='string'&&values[key].trim()
        ))
          //请求后台数据  派发事件 放到回调里面
        fetchLogin(values, (res) => {
            console.log("res1"+res.data);
            console.log("res2"+res.token);
            // this.props.dispatch(fetchLogin(values, (res) => {
            if (res.ospState == 200) {
                //const query = this.props.form.getFieldsValue()
                sessionStorage.setItem('userName', res.data.ucUser.userName)
                sessionStorage.setItem('userId', res.data.ucUser.userId)
                sessionStorage.setItem('menus', JSON.stringify(res.data.menuTrees))
                this.dealMenu(res.data.menuTrees)
                sessionStorage.setItem('token', res.token)
                sessionStorage.setItem('isLeftNavMini', false)
                //this.props.config.WEBDATA.login=true
                this.props.dispatch(changeLogout());
                // this.props.dispatch(receiveLogin({ req: data, res: resp }))
                hashHistory.push('/')
            } else  if (res.ospState == 401){

                message.warning("账号或密码错误")
                this.setState({
                    loading: false
                })
            }else {
                message.warning(res.data.msg)
                this.setState({
                    loading: false
                })
            }
        })
      }
    })
  }
  dealMenu(menus)  {
      menus.map((item)=>{
          if(item.children.length==0) {
              if(item.menuUrl) {
                  this.props.config.WEBDATA[item.menuUrl] = []
                  this.props.config.WEBDATA[item.menuUrl].isclose = false
                  this.props.config.WEBDATA[item.menuUrl].value = ''
              }
          } else {
              this.dealMenu(item.children)
          }
      })
  }

  handleChange(e) {
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  // 组件已经加载到dom中
  componentDidMount() {
    // this.props.dispatch(fetchLogin({ currentPage: 1 }))
  }

  checkName(rule, value, callback) {
    const { validateFields } = this.props.form
    if (value) {
      // validateFields([''])
    }
    callback()
  }

  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form
    if (value) {
      // validateFields([''])
    }
    callback()
  }

  noop() {
    return false
  }

  render() {
    const { loginResponse } = this.props.loginResponse
    const { getFieldDecorator } = this.props.form
      return (
          <div className="login" style={webStyle}>
              <div className="login-form">

                  <div className="login-logo">
                      <span>欢迎登陆</span>
                  </div>
                  <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                      <FormItem hasFeedback>
                          {getFieldDecorator('userName', {
                              rules: [
                                  { required: true, message: '请输入用户名' },
                                  { validator: this.checkName },
                                  // { pattern: regExpConfig.IDcardTrim, message: '身份证号格式不正确' }
                                  { pattern: "[A-Za-z0-9]{5,8}", message: '用户名只能为5-8位字符或数字' }
                              ],
                              //validateTrigger: 'onBlur',
                          })(
                              <Input
                                  prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                  placeholder="请输入用户名"
                                  type="text"
                              />
                          )}
                      </FormItem>
                      <FormItem hasFeedback>
                          {getFieldDecorator('userPwd', {
                              rules: [
                                  { required: true, message: '请输入密码' },
                                  //{ pattern: regExpConfig.pwd, message: '密码只能是6-16个数字或者字母组成' }
                                  { pattern: "[A-Za-z0-9]{5,10}", message: '密码只能为5-10位字符' }
                              ],
                              // validateTrigger: 'onBlur',
                          })(
                              <Input
                                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                  placeholder="请输入密码"
                                  type="password"
                              />
                          )}
                      </FormItem>
                      <FormItem>
                          {getFieldDecorator('remember', {
                              valuePropName: 'checked',
                              initialValue: true,
                          })(
                              <Checkbox>记住我</Checkbox>
                          )}
                          <a className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</a>
                          <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                              登录
                          </Button>
                          或 <a href="/#/register" >现在就去注册!</a>

                      </FormItem>
                  </Form>
                  </div>
              </div>


      );
  }
}











// handleSubmit (e) {
//     e.preventDefault();
//
//     this.props.form.validateFields((err, values) => {
//         if (!err) {
//             post('http://localhost:3000/login', values)
//                 .then((res) => {
//                     if (res) {
//                         message.info('登录成功');
//                         this.context.router.push('/');
//                     } else {
//                         message.info('登录失败，账号或密码错误');
//                     }
//                 });
//         }
//     });
// }
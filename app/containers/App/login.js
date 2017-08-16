
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { Spin, message, Form, Icon, Input, Button, Row, Col } from 'antd'
import { fetchLogin } from '../../actions/login'
import imgUrlWeb from '../../images/leftBg.jpg'
const FormItem = Form.Item
var webStyle = {
   // backgroundImage: `url(${imgUrlWeb})`
    background: "url('../../images/leftBg.jpg') no-repeat 0px 0px"
};
//连接 Redux 的组件 不可复用
@connect(
  (state, props) => ({
    config: state.config,
    loginResponse: state.loginResponse,
  })
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

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
        // alert("username="+values.username);
        // alert("password="+values.password);
      if (!err) {
        this.state.loading = true
         this.setState({loading: true})
        const re={} ;
        Object.keys(values).map((key) => values[key] = (values[key] && values[key].trim()))
          //请求后台数据
        this.props.dispatch(fetchLogin(values, (res) => {
          if (res.status == 1) {
            const query = this.props.form.getFieldsValue()
            // global.$GLOBALCONFIG.staff = res.data.user
            sessionStorage.setItem('staff', JSON.stringify({ ...res.data.user }))
            sessionStorage.setItem('username', query.username)
            // sessionStorage.setItem('userName', res.data.user.userName)
            // sessionStorage.setItem('userpwd', query.password)
            sessionStorage.setItem('token', res.data.token)
            sessionStorage.setItem('isLeftNavMini', false)
            hashHistory.push('/')
          }
        }, (res) => {
          message.warning(res.msg)
          this.setState({
            loading: false
          })
        }))
        // sessionStorage.setItem('token', 'kwx')
        // hashHistory.push('/')
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
        <body style={{webStyle}}>
      <div className="login">

        <div className="btmLogin">
          <div className="sy_bottom">
            <h1 id="PerformName">欢迎登陆</h1>
            <Row className="ul-wrap">
              <Col span={24}>
                <Spin spinning={this.state.loading}>
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem hasFeedback>
                      {getFieldDecorator('username', {
                        rules: [
                          { required: true, message: '请输入用户名' },
                          { validator: this.checkName },
                          // { pattern: regExpConfig.IDcardTrim, message: '身份证号格式不正确' }
                             { pattern: "[A-Za-z0-9]{5,8}", message: '用户名只能为5-8位字符或数字' }
                        ],
                         //validateTrigger: 'onBlur',
                      })(
                        <Input
                          addonBefore={<Icon type="user" />}
                          placeholder="请输入用户名"
                          type="text"
                        />
                        )}
                    </FormItem>
                    <FormItem hasFeedback>
                      {getFieldDecorator('password', {
                        rules: [
                          { required: true, message: '请输入密码' },
                          //{ pattern: regExpConfig.pwd, message: '密码只能是6-16个数字或者字母组成' }
                            { pattern: "[A-Za-z0-9]{6,10}", message: '密码只能为6-10位字符' }
                        ],
                        // validateTrigger: 'onBlur',
                      })(
                        <Input
                          addonBefore={<Icon type="lock" />}
                          placeholder="请输入密码"
                          type="password"
                        />
                        )}

                    </FormItem>
                    <FormItem>
                      <Button type="primary" htmlType="submit">登录</Button>
                    </FormItem>
                  </Form>
                </Spin>
              </Col>
            </Row>
          </div>
        </div>
        <div id="companyName" className="companyName">XX股份有限公司</div>
      </div>
        </body>
    )
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
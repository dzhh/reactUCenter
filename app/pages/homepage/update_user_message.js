/**
 * Created by kwx on 2017/8/11.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input,message, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd'
import moment from 'moment';
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { getUserMessage,updateUserMessage } from '../../ajax/user'
const FormItem = Form.Item
var user_EmailTemp=""
@connect(
    (state, props) => ({
        config: state.config,
        logout:state.logout
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)
//取得页面输入数据
@Form.create({
    onFieldsChange(props, items) {
        console.log(items)
        if(items.userEmail) {
            user_EmailTemp = items.userEmail.value;
        }
    },
})

export default class update_user_message extends Component {
    constructor(props) {
        super(props)
        let data =this.props.config.WEBDATA['updateUserMessage'].value;
        if(data){
            data = JSON.parse(data);
            this.state = {
                show: data.show,
                user:data.user,
                userEmailTemp:data.emailTemp
            }
        }else {
            this.state = {
                show: true,
                userEmailTemp:'',
                user:{}
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //页面提交信息修改
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('输入: ', values);
                let user ={};
                user.userId = this.state.user.userId;
                user.userEmail = values.userEmail;
                updateUserMessage(user, (res) => {
                    if (res.ospState == 200) {
                        message.success("修改成功",1)
                        let data =this.props.config.WEBDATA['updateUserMessage'].value;
                        if(data){
                            data = JSON.parse(data)
                            data.userEmail = ''
                        }
                        // this.props.form.setFieldsValue({
                        //     userEmail: '',
                        // });

                    } else {
                        message.warning(res.msg)
                    }
                })

            }
        });
    }
  // 页面渲染之前
    componentWillMount(){
        if(!this.state.user.userId) {
            const user = {};
            user.userName = sessionStorage.getItem('userName')
            user.userId = sessionStorage.getItem('userId')
            getUserMessage(user, (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    this.props.config.WEBDATA['updateUserMessage'].isclose = false
                    user_EmailTemp = res.data.ucUser.userEmail
                    this.setState({user: res.data.ucUser,userEmailTemp: res.data.ucUser.userEmail})
                    user_EmailTemp = res.data.ucUser.userEmail;
                }else if (res.ospState == 401){
                    message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
                } else {
                    message.warning(res.data.msg)
                }
            })
        }
    }

  // 页面销毁之前
    componentWillUnmount() {
        if(this.props.config.WEBDATA['updateUserMessage'].isclose) {
            this.props.config.WEBDATA['updateUserMessage'].value = '';
            user_EmailTemp='';
        }
       else if (this.props.logout.logoutSign) {
            let data = {
                user: this.state.user,
                show: this.state.show,
                emailTemp: user_EmailTemp,
            };
            this.props.config.WEBDATA['updateUserMessage'].value = JSON.stringify(data);
        }else {
            this.props.config.WEBDATA = [];
            user_EmailTemp='';
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {props} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };

        const user = this.state.user;
        var buttonShow = false
        if(user_EmailTemp == this.state.user.userEmail) {
            buttonShow = true;
        }
        return (
            <div style={{height:'100%',overflow:'auto'}}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                {...formItemLayout}
                label="账号(不可修改)"
                >
                <Input value={user.userName} disabled />
                </FormItem>

                <FormItem
                    {...formItemLayout }
                     label="e-mail"
                 >
                    {getFieldDecorator('userEmail', {
                        initialValue:this.state.userEmailTemp,
                        rules: [{
                            type: 'email', message: '请输入正确的email!',
                        }, {
                            required: true, message: 'E-mail不能为空!',
                        }],
                    })(
                        <Input placeholder="请输入新的e-mail" Value={this.state.userEmailTemp} />
                    )}

                </FormItem>


                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="创建时间"*/}
                    {/*>*/}
                        {/*<Input value={user.createTime} disabled />*/}
                    {/*</FormItem>*/}

                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="最后登录时间"*/}
                    {/*hasFeedback*/}
                {/*>*/}
                    {/*<Input value={user.lastLoginTime} disabled/>*/}


                {/*</FormItem>*/}


                <FormItem {...tailFormItemLayout}>
                    <Button disabled={buttonShow} type="primary" htmlType="submit" size="large">修改</Button>
                </FormItem>
            </Form></div>
        );
    }


}

/**
 * Created by kwx on 2017/8/17.
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import {Card,Checkbox,Select, Spin, message, Form, Icon, Input, Button, Row, Col } from 'antd'
import { fetchRegister} from '../../ajax/login'
import imgUrlWeb from '../../images/leftBg.jpg'
const FormItem = Form.Item

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

export default class register extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            confirmDirty: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkPassword = this.checkPassword.bind(this)
        this.checkConfirm = this.checkConfirm.bind(this)
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this)

    }

    handleSubmit(e) {

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if(!values.agreement) {
                message.warning('请阅读协议');
            } else
            if (!err) {
                console.log('Received values of form: ', values);
                const user = {};
                user.userName = values.userName
                user.userEmail = values.userEmail
                user.userPwd = values.password
                fetchRegister(user, (res) => {
                    if (res.ospState == 200) {
                        message.success("注册成功")
                        hashHistory.push('/')
                    } else  {
                        message.warning(res.message)
                        this.setState({
                            loading: false
                        })
                    }
                })
            }
        });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一样!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
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
        //addonBefore={prefixSelector}
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select className="icp-selector">
                <Option value="86">+86</Option>
            </Select>
        );
        return (

                <div style={{verticalAlign: "middle", justifyContent: "center", alignItems: "center",
                    height: "100%", background: "#f3f3f3",
                    display: "flex"
                }}>
                <Card title="新用户注册" bordered={false} style={{textAlign:"center", width: "60%" }}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="用户名"
                    hasFeedback
                >
                    {getFieldDecorator('userName', {
                        rules: [
                            {
                                required: true, message: '请输入用户名!'
                            },
                            { pattern: "[A-Za-z0-9]{5,8}", message: '用户名只能为5-8位字符或数字' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入密码!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认密码"
                    hasFeedback
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认你的密码!',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="邮箱"
                >
                    {getFieldDecorator('userEmail', {
                        rules: [{
                            type: 'email', message: '请输入正确的email!',
                        },{ required: true, message: '请输入你的邮箱!' }],
                    })(
                        <Input />
                    )}
                </FormItem>

                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="手机号码"*/}
                {/*>*/}
                    {/*{getFieldDecorator('phone', {*/}
                        {/*rules: [{ required: true, message: '请输入你的手机号码!' }],*/}
                    {/*})(*/}
                        {/*<Input />*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="验证码"*/}
                {/*>*/}
                    {/*<Row gutter={8}>*/}
                        {/*<Col span={12}>*/}
                            {/*{getFieldDecorator('captcha', {*/}
                                {/*rules: [{ required: true, message: '请输入你获取的验证码!' }],*/}
                            {/*})(*/}
                                {/*<Input size="large" />*/}
                            {/*)}*/}
                        {/*</Col>*/}
                        {/*<Col span={12}>*/}
                            {/*<Button size="large" style={{textAlign:"right"}}>获取验证码</Button>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                {/*</FormItem>*/}
                <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>我已经阅读过<a>协议</a></Checkbox>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">注册</Button>
                </FormItem>
            </Form>
                </Card>
                </div>

        );

    }
}

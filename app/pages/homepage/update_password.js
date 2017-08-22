/**
 * Created by kwx on 2017/8/11.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd'
import moment from 'moment';
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'

const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
    }),
    //(dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)

@Form.create({
    onFieldsChange(props, items) {
        // console.log(items)
        // props.cacheSearch(items);
    },
})

export default class update_password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            confirmDirty: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log(this.props)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('输入: ', values);
                //hashHistory.push('/homePage')

            }
        });
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['new_password_too'], { force: true });
        }
        callback();
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('new_password')) {
            callback('两次密码不一样');
        } else {
            callback();
        }
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    render(){
        const {getFieldDecorator} = this.props.form;

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


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="原密码"
                    hasFeedback
                >

                    {getFieldDecorator('old_password', {
                        rules: [ {
                            required: true, message: '密码不能为空!',
                        }, {
                            pattern: "^([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]){5,10}$", message: '密码错误!',
                        }],
                    })(
                        <Input type="password" placeholder="请输入旧密码"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="新密码"
                    hasFeedback>
                    {getFieldDecorator('new_password', {
                        rules: [{
                            required: true, message: '密码不能为空!',

                        }, {
                            pattern: "^([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]){5,10}$", message: '密码为5-10数字或字符!',
                        },{
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password"  placeholder="请输入新密码" />
                    )}

                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="新密码(再输入一次)"
                    hasFeedback>
                    {getFieldDecorator('new_password_too', {
                        rules: [{
                            required: true, message: '密码不能为空!',

                        }, {
                            pattern: "^([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]){5,10}$", message: '密码为5-10数字或字符!',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}  placeholder="请再输入一次新密码"/>
                    )}

                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">修改</Button>
                </FormItem>
            </Form>
        );
    }


}

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

export default class update_user_message extends Component {
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

        const config = {
            rules: [{ type: 'object', required: true, message: '请选择时间' }],
        };
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="昵称"
                    hasFeedback
                >

                    {getFieldDecorator('nickname', {
                        rules: [ {
                            required: true, message: '昵称不能为空!',
                        }],
                    })(
                        <Input placeholder="请输入昵称" defaultValue={this.props.config.USERMESSAGE.nickname} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                     label="e-mail"
                     hasFeedback>
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '请输入正确的email!',
                        }, {
                            required: true, message: 'E-mail不能为空!',
                        }],
                    })(
                        <Input placeholder="请输入e-mail" defaultValue={this.props.config.USERMESSAGE.e_amil} />
                    )}

                </FormItem>



                    <FormItem
                        {...formItemLayout}
                        label="创建时间"
                    >
                    <DatePicker defaultValue={moment(this.props.config.USERMESSAGE.creattime, 'YYYY/MM/DD HH:mm:ss')} showTime format="YYYY-MM-DD HH:mm:ss" disabled />
                    </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="最后登录时间"
                    hasFeedback
                >

                 <DatePicker defaultValue={moment(this.props.config.USERMESSAGE.lasttime, 'YYYY/MM/DD HH:mm:ss')} showTime format="YYYY-MM-DD HH:mm:ss" disabled />

                </FormItem>




                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">修改</Button>
                </FormItem>
            </Form>
        );
    }


}

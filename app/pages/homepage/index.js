/**
 * Created by kwx on 2017/8/10.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message, Form, Input, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import { getUserMessage } from '../../ajax/user'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
    })
)


export default class homepage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: true,
            confirmDirty: false,
            user:{},
        }

    }
    componentWillMount(){
        const user={};
       // user.token = sessionStorage.getItem("token");
        user.userName = sessionStorage.getItem('userName')
        user.userId = sessionStorage.getItem('userId')
        console.log(user.userName+"加载之前----------"+user.userId);

        getUserMessage(user, (res) => {
            console.log("++++++"+res);
            if (res.ospState == 200) {

                this.setState({ user: res.user})
            } else {
                message.warning(res.msg)
            }
        })
    }

    componentDidMount() {
        console.log(this.props)
    }


    onclickTest() {
        const user={};
       // user.token = sessionStorage.getItem("token");
        user.userName = sessionStorage.getItem('userName')
        user.userId = sessionStorage.getItem('userId')
        console.log(user.userName+"加载之前----------"+user.userId);

        getUserMessage(user, (res) => {
            console.log("++++++"+res);
            if (res.ospState == 200) {
            } else {
                message.warning(res.msg)
            }
        })
    }

    render(){
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


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="昵称"
                    hasFeedback
                >
                    <Input value={this.props.config.USERMESSAGE.nickname} />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="e-mail/账号"
                    hasFeedback
                >
                <Input value={this.props.config.USERMESSAGE.e_amil}  />

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="创建时间"
                    hasFeedback
                >
                    <Input value={this.props.config.USERMESSAGE.creattime}  />

                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="最后登陆时间"
                    hasFeedback
                >
                    <Input value={this.props.config.USERMESSAGE.lasttime} />

                </FormItem>

            </Form>
        );
    }


}



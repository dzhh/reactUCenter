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
        ucUser: state.ucUser,
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
                this.setState({ user: res.data.ucUser})
            } else {
                message.warning(res.msg)
            }
        })
    }

    componentDidMount() {
        console.log(this.props)
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

         const user = this.state.user;
         //const ucUser = this.props.ucUser;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="昵称"
                    hasFeedback
                >
                    <Input value={user.userName} />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="e-mail/账号"
                    hasFeedback
                >
                <Input value={user.userEmail}  />

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="创建时间"
                    hasFeedback
                >
                    <Input value={user.createTime}  />

                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="最后登陆时间"
                    hasFeedback
                >
                    <Input value={user.lastLoginTime} />

                </FormItem>

            </Form>
        );
    }


}



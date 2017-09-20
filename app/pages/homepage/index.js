/**
 * Created by kwx on 2017/8/10.
 */

import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import { connect } from 'react-redux'
import {message, Form, Input, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Card } from 'antd';
import { getUserMessage } from '../../ajax/user'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
        logout:state.logout
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

        let data = this.props.config.WEBDATA['homePage'].value;
        if(data){
              data = JSON.parse(data);
              this.state = {
                  show: data.show,
                  confirmDirty: data.confirmDirty,
                  user:data.user,
              }
        }

    }
    //页面渲染之前
    componentWillMount(){
        if(!this.state.user.userId) {
            const user = {};
            user.userName = sessionStorage.getItem('userName')
            user.userId = sessionStorage.getItem('userId')
            getUserMessage(user, (res) => {
                this.props.config.WEBDATA['homePage'].isclose = false
                if (res.ospState == 200) {
                    this.setState({user: res.data.ucUser})
                }else if (res.ospState == 401){
                    message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
                }else {
                    message.warning(res.data.msg)
                }
            })
        }
    }

    //页面销毁之前
    componentWillUnmount() {
        if(this.props.config.WEBDATA['homePage'].isclose) {
            this.props.config.WEBDATA['homePage'].value = '';
        }else if (this.props.logout.logoutSign) {
            let data = {
                user: this.state.user,
                show: this.state.show,
                confirmDirty: this.state.confirmDirty,
            };
            this.props.config.WEBDATA['homePage'].value = JSON.stringify(data);
        }else {
            this.props.config.WEBDATA = '';
        }
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
        return (
            <div style={{height:'100%',overflow:'auto'}}>
                {/*<Card style={{marginTop:'5px',marginRight:'15%',marginLeft:'15%',height:'100%'}}>*/}
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

            </Form></div>
        );
    }


}



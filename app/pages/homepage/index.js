/**
 * Created by kwx on 2017/8/10.
 */

import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import { connect } from 'react-redux'
import {message, Form, Input, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
import { getUserMessage } from '../../ajax/user'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
        ucUser: state.ucUser,
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
        //let data = window.sessionStorage.getItem("index")
        let data = this.props.config.WEBDATA.homeindex
        if(data){
              data = JSON.parse(data);
              this.state = {
                  show: data.show,
                  confirmDirty: data.confirmDirty,
                  user:data.user,
              }
        }

    }
    // componentWillReceiveProps(newProps) {
    //     if (newProps.list.data && newProps.list.data.length > 0) {
    //         //第一次加载将数据换存在全局变量Glist中;
    //         if (this.props.list.data && this.props.list.data.length <= 0) {
    //             let newData = newProps.list.data;
    //             WEBDATA = newData;
    //         }
    //         // 之后数据使用本地缓存即可
    //         else {
    //             WEBDATA = WEBDATA;
    //         }
    //     }
    // }
    // componentDidMount() {
    //     this.props.list.data && this.props.list.data.length <= 0 && this.props.getList.call(this);
    // }
    componentWillMount(){
        console.log(this.state.user+"===============index  componentWillMount=================================")
        if(!this.state.user.userId) {
            const user = {};
            // user.token = sessionStorage.getItem("token");
            user.userName = sessionStorage.getItem('userName')
            user.userId = sessionStorage.getItem('userId')
            getUserMessage(user, (res) => {
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

    // componentDidMount() {
    //     console.log("===============index  componentDidMount=================================")
    // }

    componentWillUnmount() {
        const logoutSign = this.props.logout.logoutSign
        if (logoutSign) {
            let data = {
                user: this.state.user,
                show: this.state.show,
                confirmDirty: this.state.confirmDirty,
            };
            this.props.config.WEBDATA.homeindex = JSON.stringify(data);
           // window.sessionStorage.setItem("index", JSON.stringify(data));
        }else {
            this.props.config.WEBDATA.homeindex = '';
        }
        console.log("===============index  componentWillUnmount=================================")
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



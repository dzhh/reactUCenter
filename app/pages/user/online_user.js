/**
 * Created by kwx on 2017/8/22.
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'
import { connect } from 'react-redux'
import {message,Card,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
import { getOnlineUserList,shotOffOnlineUser} from '../../ajax/user'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
        logout:state.logout
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class online_user extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:[],
            visible: false,
            auser:{}

        }
        let data =this.props.config.WEBDATA.onlineUserList;
        if(data) {
            data = JSON.parse(data);
            this.state = {
                show: data.show,
                data:data.data,
                auser:data.auser,
            }
        }
        this.showModal  = this.showModal.bind(this);

    }
    //渲染前
    componentWillMount() {
        if(this.state.data.length==0) {
            const pagination={}
            pagination.pageNo =1;
            pagination.pageSize = 100000;
            getOnlineUserList(pagination, (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    //this.state.data = res.data.ucUser
                    this.setState({data:res.data.ucUser})
                    console.log(res);
                } else {
                    message.warning('服务器异常')
                }
            })
        }
    }
    componentWillUnmount() {
        const logoutSign = this.props.logout.logoutSign
        if (logoutSign) {
            let data = {
                show: this.state.show,
                data:this.state.data,
                auser:this.state.auser,
            };
            this.props.config.WEBDATA.onlineUserList = JSON.stringify(data);
        } else {
            this.props.config.WEBDATA='';
        }

    }
    //展示弹出框
    showModal = (record) => {
        this.setState({
            auser:record,
            visible: true,

        });
    }

    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false ,auser:{}});
    }

    allowLogin  = (index) => {
        this.props.config.ONLINEUSER[index].status = 1;
        this.setState({data:this.props.config.ONLINEUSER}) ;
    }
    deleteLogin  = (index) => {
        let data = {}
            data.jwtToken = index;
        data.pageNo =1;
        data.pageSize = 100000;
        shotOffOnlineUser(data, (res) => {
            //1  有效 0 禁止
            console.log("++++++" + res);
            if (res.ospState == 200) {

                this.setState({data:res.data.ucUser})
                console.log(res);
            } else {
                message.warning('踢出失败'+res.message)
            }
        })
        // this.props.config.ONLINEUSER[index].status = 0;
        // this.setState({data:this.props.config.ONLINEUSER}) ;
    }



    render() {

        const columns = [{
            title: 'SessionID',
            dataIndex: 'jwtToken',
            render: (text, record, index) => {
                const a = text;
                        return a.substring(a.length-32,a.length);
                     }
        }, {
            title: '账号',
            dataIndex: 'userName',
        },{
            title: 'Email',
            dataIndex: 'userEmail',
        },{
            title: '创建回话',
            dataIndex: 'createJWTTime',
        },{
            title: '回话最后活动时间',
            dataIndex: 'lastActionTime',
        },
        //     {
        //     title: '状态',
        //     dataIndex: 'status',
        //     render: (text, record, index) => {
        //         return (text > 0? ("有效"):("已踢出"));
        //     }
        // },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = ''
                     record.status > 0 ?(title_action = "踢出"+record.userName):(title_action = "激活"+record.nickName);
                    return (
                        this.state.data.length > 1 ?
                            (
                                <div> <Popconfirm title={title_action} onConfirm={() => this.deleteLogin(record.jwtToken)}>
                                    <a href="#">踢出</a>
                                </Popconfirm>
                                    <span className="ant-divider" />
                                    <a onClick={() => this.showModal(record)}
                                    >详情</a>
                                </div>

                                       // ( record.status > 0 ?
                                       //         (<div> <Popconfirm title={title_action} onConfirm={() => this.deleteLogin(index)}>
                                       //         <a href="#">踢出</a>
                                       //        </Popconfirm>
                                       //             <span className="ant-divider" />
                                       //                 <a onClick={() => this.showModal(record)}
                                       //                 >详情</a>
                                       //         </div>
                                       //      ):
                                       //      (<div> <Popconfirm title={title_action} onConfirm={() => this.allowLogin(index)}>
                                       //              <a href="#">激活</a>
                                       //          </Popconfirm>
                                       //              <span className="ant-divider" />
                                       //
                                       //              <a onClick={() => this.showModal(record)}
                                       //                 >详情</a>
                                       //
                                       //          </div>
                                       //      )
                                       // )


                            ) : null
                    );
                },
            }
        ];

        const auser = this.state.auser;
        return (

                <div>
                    <Modal
                        visible={this.state.visible}
                        title="Session详情"
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="small" onClick={this.handleCancel}>返回</Button>,

                        ]}
                    >
                        <Form layout="vertical">
                            <FormItem label="Session Id">
                                <Input value={auser.jwtToken}  />
                            </FormItem>
                            <FormItem label="创建时间">
                                <Input value={auser.createJWTTime}   />
                            </FormItem>
                            <FormItem label="会话最后活动时间">
                                <Input value={auser.lastActionTime}   />
                            </FormItem>
                            {/*<FormItem label="Session 状态">*/}
                                {/*<Input value={auser.status>0?"有效":"已踢出"}  disabled />*/}
                            {/*</FormItem>*/}
                            <FormItem label="账号">
                                <Input value={auser.userName}   />
                            </FormItem>
                            <FormItem label="Email">
                                <Input value={auser.userEmail}  />
                            </FormItem>

                        </Form>
                    </Modal><Card>
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
                </div>
        );
    }
}





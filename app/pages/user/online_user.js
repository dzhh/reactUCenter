/**
 * Created by kwx on 2017/8/22.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
    }),

)


export default class online_user extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:this.props.config.ONLINEUSER,
            visible: false,
            auser:{}

        }

        this.showModal  = this.showModal.bind(this);

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
        this.props.config.ONLINEUSER[index].status = 0;
        this.setState({data:this.props.config.ONLINEUSER}) ;
    }



    render() {

        const columns = [{
            title: 'SessionID',
            dataIndex: 'sessionID',
        }, {
            title: '昵称',
            dataIndex: 'nickName',
        },{
            title: 'Email/帐号',
            dataIndex: 'email',
        },{
            title: '创建回话',
            dataIndex: 'createTime',
        },{
            title: '回话最后活动',
            dataIndex: 'lastTime',
        },{
            title: '状态',
            dataIndex: 'status',
            render: (text, record, index) => {
                return (text > 0? ("有效"):("已踢出"));
            }
        },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = ''
                     record.status > 0 ?(title_action = "踢出"+record.nickName):(title_action = "激活"+record.nickName);
                    return (
                        this.state.data.length > 1 ?
                            (

                                       ( record.status > 0 ?
                                               (<div> <Popconfirm title={title_action} onConfirm={() => this.deleteLogin(index)}>
                                               <a href="#">踢出</a>
                                              </Popconfirm>
                                                   <span className="ant-divider" />
                                                       <a onClick={() => this.showModal(record)}
                                                       >详情</a>
                                               </div>
                                            ):
                                            (<div> <Popconfirm title={title_action} onConfirm={() => this.allowLogin(index)}>
                                                    <a href="#">激活</a>
                                                </Popconfirm>
                                                    <span className="ant-divider" />

                                                    <a onClick={() => this.showModal(record)}
                                                       >详情</a>

                                                </div>
                                            )
                                       )


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
                                <Input defaultValue={auser.sessionID} disabled />
                            </FormItem>
                            <FormItem label="Session创建时间">
                                <Input defaultValue={auser.createTime}  disabled />
                            </FormItem>
                            <FormItem label="Session最后交互时间">
                                <Input defaultValue={auser.lastTime}  disabled />
                            </FormItem>
                            <FormItem label="Session 状态">
                                <Input defaultValue={auser.status>0?"有效":"已踢出"}  disabled />
                            </FormItem>
                            <FormItem label="昵称">
                                <Input defaultValue={auser.nickName}  disabled />
                            </FormItem>
                            <FormItem label="Email/帐号">
                                <Input defaultValue={auser.email}  disabled />
                            </FormItem>

                        </Form>
                    </Modal>
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </div>
        );
    }
}





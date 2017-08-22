/**
 * Created by kwx on 2017/8/22.
 */
/**
 * Created by kwx on 2017/8/21.
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
@Form.create({
    onFieldsChange(props, items) {
        // console.log(items)
        // props.cacheSearch(items);
    },
})

export default class online_user extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:this.props.config.ONLINEUSER,
            visible: false,

        }


        //this.onDelete  = this.onDelete .bind(this);

    }

    //展示弹出框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    //弹出框点击ok
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if(!err) {
                // values.key=values.name;
                //console.log(values);
                console.log("验证成功"+values.roleName+values.systemcode)
                // this.props.config.DATA.push(values);
                // this.setState({data:this.props.config.DATA}) ;
                //  console.log(this.props.config.DATA);
                this.setState({loading: true});
                //this.setState({ loading: false, visible: false });
                setTimeout(() => {
                    this.setState({loading: false, visible: false});
                }, 3000);
            }
        })


    }
    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false });
    }

    allowLogin  = (index) => {
        this.props.config.ONLINEUSER[index].status = 1;
        this.setState({data:this.props.config.ONLINEUSER}) ;
    }
    deleteLogin  = (index) => {
        this.props.config.ONLINEUSER[index].status = 0;
        this.setState({data:this.props.config.ONLINEUSER}) ;
    }
    onDelete  = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            console.log('删除的IDs: ', this.state.selectedRowRoleIds);
            // const data = [...this.state.data];
            //
            // this.setState({ dataSource });
            // this.state.selectedRowKeys.map((item,index)=>{
            //     console.log(index+"--"+item);
            //     console.log(dataSource.splice(item,1));
            // });
            //this.setState({ selectedRowKeys });
            this.setState({
                selectedRowRoleIds: [],
                loading: false,
                //searchText: '',
            });
        }, 1000);
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
                                                   <a href="#">详情</a>
                                               </div>
                                            ):
                                            (<div> <Popconfirm title={title_action} onConfirm={() => this.allowLogin(index)}>
                                                    <a href="#">激活</a>
                                                </Popconfirm>
                                                    <span className="ant-divider" />
                                                    <a href="#">详情</a>
                                                </div>
                                            )
                                       )


                            ) : null
                    );
                },
            }
        ];


        // const {loading,selectedRowRoleIds } = this.state;
        // const rowSelection = {
        //     selectedRowRoleIds,
        //     onChange: this.onSelectChange,
        // };

        return (
            <div>
                <div>
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </div></div>
        );
    }
}





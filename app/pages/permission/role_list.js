/**
 * Created by kwx on 2017/8/21.
 */


import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'
import {roleList,deleteRole,addRole,testPer} from '../../ajax/userRole'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
        logout:state.logout
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })

)
@Form.create({
    onFieldsChange(props, items) {
        // console.log(items)
        // props.cacheSearch(items);
    },
})

export default class role_list extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:[],
            visible: false,
            staticData: [],
            deleteIds:[]

        }
        let data =this.props.config.WEBDATA.roleList;
        if(data) {
            data = JSON.parse(data);
            this.state = {
                show: data.show,
                selectedRowKeys:data.selectedRowKeys,
                staticData:data.staticData,
                deleteIds:data.deleteIds,
                data:data.data,
                searchText:data.searchText
            }
        }
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDelete  = this.onDelete .bind(this);

    }
    //组件渲染之前
    componentWillMount() {
        if(this.state.data.length==0) {
            const pagination={}
            pagination.pageNo =1;
            pagination.pageSize = 100000;
            roleList(pagination, (res) => {
                //1  有效 0 禁止
                console.log("++++++" + res);
                if (res.ospState == 200) {

                    this.setState({data:res.data.ucRole,staticData:res.data.ucRole})
                    console.log(res);
                } else {
                    message.warning(res.msg)
                }
            })
            // var menuIds="10,11";
            // testPer(menuIds, (res) => {
            //     //1  有效 0 禁止
            //     console.log("++++++" + res);
            //     if (res.ospState == 200) {
            //
            //         console.log(res);
            //     } else {
            //         message.warning(res.msg)
            //     }
            // })

        }
    }

    //组件销毁时
    componentWillUnmount() {
        const logoutSign = this.props.logout.logoutSign
        if (logoutSign) {
            let data = {
                show: this.state.show,
                selectedRowKeys:this.state.selectedRowKeys,
                data:this.state.data,
                deleteIds:this.state.deleteIds,
                staticData:this.state.staticData,
                searchText:this.state.searchText
            };
            this.props.config.WEBDATA.roleList = JSON.stringify(data);
        } else {
            this.props.config.WEBDATA='';
        }

    }
    deleteIds=(ids)=>{
        let pagination={}
        pagination.pageNo =1;
        pagination.pageSize = 100000;
        pagination.ids = ids.toString()
        deleteRole(pagination, (res) => {
            //1  有效 0 禁止
            console.log("++++++" + res);
            if (res.ospState == 200) {
                this.setState({ loading: true });
                setTimeout(() => {
                    console.log('删除的IDs: ', this.state.deleteIds);
                    this.setState({
                        selectedRowKeys: [],
                        deleteIds:[],
                        loading: false,
                    });
                }, 1000);
                this.setState({data:res.data.ucRole,staticData:res.data.ucRole})
                console.log(res);
            } else {
                message.warning(res.msg)
            }
        })
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

                console.log("验证成功"+values.roleName+values.systemcode)
                const role={};
                role.roleName = values.roleName
                addRole(role, (res) => {
                    //1  有效 0 禁止
                    console.log("++++++" + res);
                    if (res.ospState == 200) {
                        this.setState({ loading: true });
                        setTimeout(() => {
                            this.setState({
                                selectedRowKeys: [],
                                deleteIds:[],
                                loading: false,
                                visible: false
                            });
                        }, 1000);
                        this.setState({data:res.data.UcRole,staticData:res.data.UcRole})
                        console.log(res);
                    } else {
                        message.warning(res.msg+res.data.UcRole)
                    }
                })

            }
        })


    }
    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false });
    }
    deleteRole  = (index) => {
        let ids=[];
        ids.push(index)
        this.deleteIds(ids)
    }
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的角色');
        }else {
            this.deleteIds(this.state.deleteIds)
        }
    }
    //获得输入框的搜索的值
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }
    //选择的table每一行的key值
    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log("每行"+selectedRows)
        let ids = [];
        selectedRows.map((item)=>{
            ids.push(item.roleId)
        })

        this.setState({ selectedRowKeys})

        this.setState({ deleteIds:ids})
        console.log("userid==="+ this.state.deleteIds)
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            // filterDropdownVisible: false,
            data: this.state.staticData.map((record) => {
                const match = record.roleName.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.roleName.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }
    render() {

        const columns = [{
            title: '角色名称',
            dataIndex: 'roleName',
        }, {
            title: '角色类型',
            dataIndex: 'systemcode',
        },,
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = "删除"+record.roleName
                    return (
                        this.state.data.length > 1 ?
                            (
                                    ( <Popconfirm title={title_action} onConfirm={() => this.deleteRole(record.roleId)}>
                                            <a href="#">删除</a>
                                        </Popconfirm>
                                    )
                            ) : null
                    );
                },
            }
        ];


        const {loading,selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const { getFieldDecorator } = this.props.form
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div className="custom-filter-dropdown">
                    <Input
                        placeholder="输入角色名称"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                        style={{width: '20%',
                            marginRight: '8px'}}
                    />
                    <Button type="primary" onClick={this.onSearch} >搜索</Button>
                    {/*---------------*/}
                    <Button type="primary" onClick={this.showModal} style={{marginLeft:"10px"}}>
                        添加
                    </Button>
                    <Button type="danger" onClick={this.onDelete}
                            loading={loading}
                            style={{marginLeft:"10px",backgroundColor:'#EE0000',color:'white'}}
                    >
                        删除</Button>
                    {/******************/}
                    <Modal
                        visible={this.state.visible}
                        title="角色添加"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                                添加
                            </Button>,
                        ]}
                    >
                        <Form layout="vertical">
                            <FormItem label="角色名称">
                                {getFieldDecorator('roleName', {
                                    rules: [{ required: true, message: '请输入角色名称!' }],
                                })(
                                    <Input placeholder="请输入角色名称!"/>
                                )}
                            </FormItem>
                            <FormItem label="角色类型">
                                {getFieldDecorator('systemcode', {
                                    rules: [{ required: true, message: '请输入角色类型!' },
                                { pattern: "[A-Za-z0-9]{6}", message: '角色类型为[字母+数字]6位！' }
                                    ],

                                })(
                                    <Input placeholder="请输入角色类型[字母+数字]6位"/>
                                )}
                            </FormItem>

                        </Form>
                    </Modal>
                    {/*---------------*/}
                </div>
                <div> <Card style={{marginTop:'5px'}}>
                    <Table  bordered rowSelection={rowSelection} columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
                </div></div>
        );
    }
}





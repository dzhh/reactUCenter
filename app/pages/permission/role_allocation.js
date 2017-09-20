/**
 * Created by kwx on 2017/8/29.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import {allocationLists,selectRolesByUserId,addRolesUser,clearRoleByUserIds} from '../../ajax/userRole'
import {message,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group;

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

export default class role_allocation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:[],
            staticData:[],
            visible: false,
            checkedList: [],
            indeterminate: true,
            checkAll: false,
            selectId:'',
            options:[],
            plainOptions:[],
            deleteIds:[]

        }
        let data =this.props.config.WEBDATA['roleAllocation'].value;
        if(data) {
            data = JSON.parse(data);
            this.state = {
                show: data.show,
                selectedRowKeys:data.selectedRowKeys,
                data:data.data,
                visible:data.visible,
                deleteIds:data.deleteIds,
                staticData:data.staticData,
                searchText:data.searchText
            }
        }
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDelete  = this.onDelete .bind(this);

    }
    //组件渲染之前
    componentWillMount() {
        if(this.state.data.length==0) {
        let pagination={}
        pagination.pageNo =1;
        pagination.pageSize = 10000;
         allocationLists(pagination, (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    this.setState({data:res.data.ucUserRole,staticData:res.data.ucUserRole})
                    console.log(res);
                }else if (res.ospState == 401){
                    message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
                } else {
                    message.warning(res.data.msg)
                }
            })

        }
    }

    //组件销毁时
    componentWillUnmount() {
        if(this.props.config.WEBDATA['roleAllocation'].isclose) {
            this.props.config.WEBDATA['roleAllocation'].value = '';

        }else if (this.props.logout.logoutSign) {
            let data = {
                show: this.state.show,
                selectedRowKeys:this.state.selectedRowKeys,
                data:this.state.data,
                visible:this.state.visible,
                deleteIds:this.state.deleteIds,
                staticData:this.state.staticData,
                searchText:this.state.searchText
            };
            this.props.config.WEBDATA['roleAllocation'].value = JSON.stringify(data);
        } else {
            this.props.config.WEBDATA='';
        }

    }

    //展示弹出框
    showModal = (record) => {
        let user={}
        user.id = record.userId
        user.pageNo =1
        user.pageSize = 10000
        selectRolesByUserId(user, (res) => {
            console.log("++++++" + res);
            if (res.ospState == 200) {
                res.data.defaultValue = res.data.defaultValue.split(',')
                res.data.allRoleIds = res.data.allRoleIds.split(',')
                this.setState({checkedList:res.data.defaultValue,options:res.data.ucRole,
                    plainOptions:res.data.allRoleIds,
                    selectId:record.userId,
                    visible: true,
                })
                console.log(res);
            }else if (res.ospState == 401){
                message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
            } else {
                message.warning(res.data.msg)
            }
        })

    }
    //弹出框点击ok
    handleOk = () => {
    console.log("选中的角色id为"+this.state.checkedList);
        let user = {};
        user.id = this.state.selectId
        user.ids = this.state.checkedList.toString()
        addRolesUser(user, (res) => {
            console.log("++++++" + res);
            if (res.ospState == 200) {

                setTimeout(() => {
                    this.setState({
                        data: res.data.ucUserRole, staticData: res.data.ucUserRole,
                        visible: false,
                    })
                })
                console.log(res);
            } else if (res.ospState == 401) {
                message.warning("没有登录或登录时间过期，请重新登录", 2, () => {
                    hashHistory.push('/login')
                })
            } else {
                message.warning(res.msg)
            }
        })


    }
    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false,  checkedList: [],
            defaultId: [] });
    }

    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log("每行"+selectedRows)
        let ids = [];
        selectedRows.map((item)=>{
            ids.push(item.userId)
        })
        this.setState({ selectedRowKeys})

        this.setState({ deleteIds:ids})

    }
        //删除
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要清空的用户角色');
        }else {
            this.setState({loading: true});
            let user = {};
            user.ids = this.state.deleteIds.toString()
            clearRoleByUserIds(user, (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {

                    setTimeout(() => {
                        this.setState({
                            data: res.data.ucUserRole, staticData: res.data.ucUserRole,
                            visible: false,
                            selectedRowKeys: [],
                            loading: false,
                            deleteIds:[]
                        })
                    })
                    console.log(res);
                } else if (res.ospState == 401) {
                    message.warning("没有登录或登录时间过期，请重新登录", 2, () => {
                        hashHistory.push('/login')
                    })
                } else {
                    message.warning(res.msg)
                }
            })

        }
    }
    //获得输入框的搜索的值
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }

    checkOnChange = (checkedList) => {
        console.log('每次改变的值 ', checkedList);
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
            checkAll: checkedList.length === this.state.plainOptions.length,
        });
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            // filterDropdownVisible: false,
            data: this.state.staticData.map((record) => {
                const match = record.userName.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.userName.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }

    onChange = (checkedList) => {

    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.state.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }
    render() {

        const columns = [{
            title: '用户昵称',
            dataIndex: 'userName',
        }, {
            title: 'Email',
            dataIndex: 'userEmail',
        }, {
             title:'状态',
            dataIndex: 'status',
            render: (text, record, index) => {
                return (text > 0? ("有效"):("无效"));
            }
        }, {
            title:'拥有的角色',
            dataIndex: 'roleNames',
        }
        ,
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        this.state.data.length > 1 ?
                                (
                                    <a onClick={() => this.showModal(record)}>选择角色</a>
                                )
                             : null
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
            <div style={{height:'100%',overflow:'auto'}}>
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

                    <Button type="danger" onClick={this.onDelete}
                            loading={loading}
                            style={{marginLeft:"10px",backgroundColor:'#EE0000',color:'white'}}
                    >
                        清空用户角色</Button>
                    {/******************/}
                    <Modal style={{width:'60%'}}
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
                        <Form layout="vertical" >
                            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                <Checkbox
                                    indeterminate={this.state.indeterminate}
                                    onChange={this.onCheckAllChange}
                                    checked={this.state.checkAll}
                                >
                                   全选
                                </Checkbox>
                            </div>
                            <br/>
                            <div style={{width:'25%'}}>
                            <CheckboxGroup    options={this.state.options} value={this.state.checkedList} onChange={this.checkOnChange} />
                            </div>
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





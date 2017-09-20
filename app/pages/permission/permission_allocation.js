/**
 * Created by kwx on 2017/8/29.
 */


import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import {rolePermissionAllocation,selectPermissionByRoleId,addPermission2Role,clearPermissionByRoleIds} from '../../ajax/rolePermission'
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

export default class permission_allocation extends Component {
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
            defaultId:'',
            options:[],
            plainOptions:[],
            deleteIds:[]

        }
        let data =this.props.config.WEBDATA['permission/rolePermissionAllocation'].value;
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
        if(this.state.data.length == 0) {

        rolePermissionAllocation('', (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    this.setState({data:res.data.rolePermission,staticData:res.data.rolePermission})
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
        if(this.props.config.WEBDATA['permission/rolePermissionAllocation'].isclose) {
            this.props.config.WEBDATA['permission/rolePermissionAllocation'].value = '';

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
            this.props.config.WEBDATA['permission/rolePermissionAllocation'].value = JSON.stringify(data);
        } else {
            this.props.config.WEBDATA=[];
        }

    }

    //展示弹出框
    showModal = (record) => {
        let user={}
        user.id = record.roleId
        selectPermissionByRoleId(user, (res) => {
            console.log("++++++" + res);
            if (res.ospState == 200) {
                if(res.data.defaultValue == null) {
                    res.data.defaultValue = '';
                }
                res.data.defaultValue = res.data.defaultValue.split(',')
                res.data.allPermissionIds = res.data.allPermissionIds.split(',')
                this.setState({checkedList:res.data.defaultValue,options:res.data.permissionLists,
                    plainOptions:res.data.allPermissionIds,
                    selectId:record.roleId,
                    visible: true,
                })
                console.log(res);
            }else if (res.ospState == 401){
                message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
            } else {
                message.warning(res.msg)
            }
        })

    }
    //弹出框点击ok
    handleOk = () => {

        console.log("选中的角色id为"+this.state.checkedList);
        let user = {};
        user.id = this.state.selectId
        user.ids = this.state.checkedList.toString()
        addPermission2Role(user, (res) => {
            console.log("++++++" + res);
            if (res.ospState == 200) {

                setTimeout(() => {
                    this.setState({
                        data: res.data.rolePermission, staticData: res.data.rolePermission,
                        visible: false,
                    })
                })
                console.log(res);
            } else if (res.ospState == 401) {
                message.warning("没有登录或登录时间过期，请重新登录", 2, () => {
                    hashHistory.push('/login')
                })
            } else {
                message.warning(res.data.msg)
            }
        })



    }
    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false,  checkedList: [],
            defaultId: [] });
    }
    // deleteRole  = (index) => {
    //     // this.props.config.USER[index].status = 0;
    //     console.log("要删除的角色id"+index);
    //     this.setState({data:ROLE});
    // }

    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要清空权限的角色');
        }else {
            this.setState({loading: true});
            let user = {};
            user.ids = this.state.deleteIds.toString()
            clearPermissionByRoleIds(user, (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {

                    setTimeout(() => {
                        this.setState({
                            data: res.data.rolePermission, staticData: res.data.rolePermission,
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
    //选择的table每一行的key值
    // onSelectChange = (selectedRowKeys) => {
    //     console.log('选择的id: ', selectedRowKeys);
    //     this.setState({ selectedRowKeys });
    // }
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

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
            checkAll: checkedList.length === this.state.plainOptions.length,
        });
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.state.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
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

    }
    render() {

        const columns = [{
            title: '角色名称',
            dataIndex: 'roleName',
        }, {
            title:'拥有的权限',
            dataIndex: 'menuNames',
        }
        ,
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        this.state.data.length > 0 ?
                            (
                                <a onClick={() => this.showModal(record)}>选择权限</a>
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
                    <Modal style={{width:'60%'}}
                           visible={this.state.visible}
                           title="权限添加"
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
                                <CheckboxGroup  options={this.state.options} value={this.state.checkedList} onChange={this.onChange} />
                            </div>
                        </Form>
                    </Modal>
                    {/*---------------*/}
                </div>
                <div>  <Card style={{marginTop:'5px'}}>
                    <Table  bordered rowSelection={rowSelection}   columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
                </div>
            </div>
        );
    }
}





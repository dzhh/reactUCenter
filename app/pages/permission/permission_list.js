/**
 * Created by kwx on 2017/8/29.
 */


import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import {permissionList,deletePermission} from '../../ajax/userRole'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Alert,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
const FormItem = Form.Item
const permissions = [{key:1,permissionName:'权限1',permissionUrl:'权限url'},
    {key:2,permissionName:'权限2',permissionUrl:'权限url'},
    {key:3,permissionName:'权限3',permissionUrl:'权限url'},
    {key:4,permissionName:'权限4',permissionUrl:'权限url'},
    {key:5,permissionName:'权限5',permissionUrl:'权限url'}
]
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

export default class permission_list extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:[],
            staticData:[],
            visible: false,
            searchText:'',
            deleteIds:[]
        }

        let data =this.props.config.WEBDATA.permissionList;
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
            permissionList('', (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    this.setState(
                        {data:res.data.permissionLists,
                        staticData:res.data.permissionLists}
                        )

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
            this.props.config.WEBDATA.permissionList = JSON.stringify(data);
        } else {
            this.props.config.WEBDATA='';
        }

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
    deleteIds=(ids)=>{
        let pagination={}
        pagination.pageNo =1;
        pagination.pageSize = 100000;
        pagination.ids = ids.toString()
        deletePermission(pagination, (res) => {
            //1  有效 0 禁止
            console.log("++++++" + res);
            if (res.ospState == 200) {
                console.log("返回的结果+++"+res);
                this.setState({ loading: true });
                setTimeout(() => {
                    console.log('删除的IDs: ', this.state.deleteIds);
                    this.setState({
                        selectedRowKeys: [],
                        deleteIds:[],
                        loading: false,
                    });
                }, 1000);
                this.setState({data:res.data.permissionList,staticData:res.data.permissionList})

            } else {
                message.warning(res.msg)
            }
        })
    }
    deletePermission  = (index) => {
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
            ids.push(item.permissionId)
        })

        this.setState({ selectedRowKeys})
        this.state.deleteIds = ids;
        console.log("menuId==="+ this.state.deleteIds)
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            // filterDropdownVisible: false,
            data: this.state.staticData.map((record) => {
                const match = record.label.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.label.split(reg).map((text, i) => (
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
            title: '权限名称',
            dataIndex: 'label',
        }, {
            title: '权限url',
            dataIndex: 'menuUrl',
        },{
            title: '类型',
            dataIndex: 'permissionType',
        },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = "删除"+record.menuName
                    return (
                        this.state.data.length > 1 ?
                            (
                                ( <Popconfirm title={title_action} onConfirm={() => this.deletePermission(record.permissionId)}>
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
            <div style={{height:'80%'}}>
                <div className="custom-filter-dropdown">
                    <Input
                        placeholder="输入权限名称"
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
                        <Form layout="vertical">
                            <FormItem label="权限名称">
                                {getFieldDecorator('permissionName', {
                                    rules: [{ required: true, message: '请输入权限名称!' }],
                                })(
                                    <Input placeholder="请输入权限名称!"/>
                                )}
                            </FormItem>
                            <FormItem label="权限url">
                                {getFieldDecorator('permissionUrl', {
                                    rules: [{ required: true, message: '请输入权限url!' },
                                    ],

                                })(
                                    <Input placeholder="请输入权限url"/>
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





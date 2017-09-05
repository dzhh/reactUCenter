/**
 * Created by kwx on 2017/8/29.
 */


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
    }),

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
            data:permissions,
            visible: false,
        }

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDelete  = this.onDelete .bind(this);

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
    deleteRole  = (index) => {
        // this.props.config.USER[index].status = 0;
        console.log("要删除的角色id"+index);
        this.setState({data:permissions}) ;
    }

    onDelete  = () => {
               if(this.state.selectedRowKeys == '') {
                   message.error('请选择要删除的权限');
               }else {
                   this.setState({loading: true});
                   // ajax request after empty completing
                   setTimeout(() => {
                       console.log('删除的IDs: ', this.state.selectedRowKeys);
                       // const data = [...this.state.data];
                       //
                       // this.setState({ dataSource });
                       // this.state.selectedRowKeys.map((item,index)=>{
                       //     console.log(index+"--"+item);
                       //     console.log(dataSource.splice(item,1));
                       // });
                       //this.setState({ selectedRowKeys });
                       this.setState({
                           selectedRowKeys: [],
                           loading: false,
                           //searchText: '',
                       });
                   }, 1000);
               }

    }
    //获得输入框的搜索的值
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }
    //选择的table每一行的key值
    onSelectChange = (selectedRowKeys) => {
        console.log('选择的id: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            // filterDropdownVisible: false,
            data: permissions.map((record) => {
                const match = record.permissionName.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    permissionName: (
                        <span>
              {record.permissionName.split(reg).map((text, i) => (
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
            dataIndex: 'permissionName',
        }, {
            title: '权限url',
            dataIndex: 'permissionUrl',
        },,
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = "删除"+record.permissionName
                    return (
                        this.state.data.length > 1 ?
                            (
                                ( <Popconfirm title={title_action} onConfirm={() => this.deleteRole(record.key)}>
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





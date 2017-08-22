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

export default class role_list extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowRoleIds: [],
            show: true,
            loading: false,
            data:this.props.config.ROLE,
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
        this.setState({data:this.props.config.ROLE}) ;
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
    //获得输入框的搜索的值
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }
    //选择的table每一行的key值
    onSelectChange = (selectedRowRoleIds) => {
        console.log('选择的id: ', selectedRowRoleIds);
        this.setState({ selectedRowRoleIds });
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            // filterDropdownVisible: false,
            data: this.props.config.ROLE.map((record) => {
                const match = record.roleName.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    roleName: (
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


        const {loading,selectedRowRoleIds } = this.state;
        const rowSelection = {
            selectedRowRoleIds,
            onChange: this.onSelectChange,
        };

        const { getFieldDecorator } = this.props.form
        const hasSelected = selectedRowRoleIds.length > 0;
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
                    <Button type="primary" onClick={this.onDelete}
                            disabled={!hasSelected} loading={loading} style={{marginLeft:"10px"}}
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
                <div>
                    <Table  bordered rowSelection={rowSelection} columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </div></div>
        );
    }
}





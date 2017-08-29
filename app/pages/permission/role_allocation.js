/**
 * Created by kwx on 2017/8/29.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group;
var ROLE = [
    {key:1,id:11,nickName:'test1',userEmail:'baidu@qq.com',status:'1',roles:'系统管理员',defaultValue:['1']},
    {key:2,id:22,nickName:'test2',userEmail:'baidu@qq.com',status:'0',roles:'权限角色,用户中心',defaultValue:['2','3']},
    {key:3,id:33,nickName:'test3',userEmail:'baidu@qq.com',status:'1',roles:'用户中心',defaultValue:['3']},
    {key:4,id:33,nickName:'test4',userEmail:'baidu@qq.com',status:'0',roles:'权限角色,用户中心',defaultValue:['2','3']},
    {key:5,id:55,nickName:'test5',userEmail:'baidu@qq.com',status:'0',roles:'系统管理员',defaultValue:['1']},
];
const plainOptions = ['系统管理员', '权限角色', '用户中心'];
const options = [ {label: '系统管理员', value: '1'},{label: '权限角色', value: '2'},{label: '用户中心', value: '3'}];
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

export default class role_allocation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:ROLE,
            visible: false,
            checkedList: [],
            indeterminate: true,
            checkAll: false,
            defaultId:'',

        }

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDelete  = this.onDelete .bind(this);

    }

    //展示弹出框
    showModal = (index) => {

        this.setState({
            defaultId:index,
            checkedList:this.state.data[index].defaultValue,
            visible: true,
        });
    }
    //弹出框点击ok
    handleOk = () => {


                this.state.data[this.state.defaultId].defaultValue = this.state.checkedList;

                console.log("验证成功"+this.state.checkedList)
                let roles = '';
               this.state.checkedList.map((item,index)=>{
                    if(item == 1) {
                        if(roles == '') {
                            roles = '系统管理员'
                        } else {
                            roles =roles+ ',系统管理员'
                        }
                    } else if(item == 2) {
                        if(roles == '') {
                            roles = '权限角色'
                        } else {
                            roles =roles+ ',权限角色'
                        }
                    }else if(item == 3) {
                        if(roles == '') {
                            roles = '用户中心'
                        } else {
                            roles =roles+ ',用户中心'
                        }
                    }
               })
        this.state.data[this.state.defaultId].roles = roles;
                this.setState({loading: true});

                setTimeout(() => {
                    this.setState({loading: false,
                        visible: false,
                        checkedList: [],
                        defaultId: []
                    });
                }, 1000);

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
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            console.log('删除的IDs: ', this.state.selectedRowKeys);
            this.state.selectedRowKeys.map((item,index)=>{
                this.state.data.map((item1,index)=>{
                    if(item == item1.key){
                        this.state.data[index].roles='';
                        this.state.data[index].defaultValue=[];
                    }
                })
                console.log(item+"===="+index);
                //
                //this.state.data[item].defaultValue=[];
            })

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
            });
        }, 1000);
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
            data: this.state.data.map((record) => {
                const match = record.nickName.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    nickName: (
                        <span>
              {record.nickName.split(reg).map((text, i) => (
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
            indeterminate: !!checkedList.length && (checkedList.length < options.length),
            checkAll: checkedList.length === options.length,
        });
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? options : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }
    render() {

        const columns = [{
            title: '用户昵称',
            dataIndex: 'nickName',
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
            dataIndex: 'roles',
        }
        ,
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        this.state.data.length > 1 ?
                                (
                                    <a onClick={() => this.showModal(index)}>选择角色</a>
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

                    <Button type="primary" onClick={this.onDelete}
                            disabled={!hasSelected} loading={loading} style={{marginLeft:"10px"}}
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
                            <CheckboxGroup  options={options} value={this.state.checkedList} onChange={this.onChange} />
                            </div>
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





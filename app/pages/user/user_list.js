/**
 * Created by kwx on 2017/8/16.
 */

import { getUserList } from '../../ajax/user'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Card,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
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

export default class user_list extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:this.props.config.USER,
            visible: false,

        }

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDelete  = this.onDelete .bind(this);

    }
    //组件渲染之前
    componentWillMount() {
        //if(!this.state.user.userId) {
           
       // }
    }

    //展示弹出框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    //允许登陆
    allowLogin  = (index) => {
        this.props.config.USER[index].status = 0;
        this.setState({data:this.props.config.USER}) ;
    }
    //禁止登陆
    stopLogin  = (index) => {
        this.props.config.USER[index].status = 1;
        this.setState({data:this.props.config.USER}) ;
    }
    //删除
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的用户');
        }else {

        this.setState({ loading: true });
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
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            // filterDropdownVisible: false,
            data: this.props.config.USER.map((record) => {
                const match = record.email.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.name.split(reg).map((text, i) => (
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
            title: '昵称',
            dataIndex: 'name',
        }, {
            title: 'Email/账号',
            dataIndex: 'email',
        }, {
            title: '登录状态',
            dataIndex: 'status',
            render: (text, record, index) => {
                return (text > 0? ("有效"):("禁止"));
            }
        }, {
            title: '创建时间',
            dataIndex: 'createtime',
        }, {
            title: '最后登陆时间',
            dataIndex: 'lasttime',
        },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = '';
                    record.status > 0 ?(title_action = "禁止"+record.name+"登陆?"):(title_action = "允许"+record.name+"登陆?");
                    return (
                        this.state.data.length > 1 ?
                            (
                                record.status > 0 ?
                                    ( <Popconfirm title={title_action} onConfirm={() => this.allowLogin(index)}>
                                            <a href="#">禁止登陆</a>
                                          </Popconfirm>
                                    ):(
                                    <Popconfirm title={title_action} onConfirm={() => this.stopLogin(index)}>
                                        <a href="#">激活登陆</a>
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
                        placeholder="输入Email/账号"
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
                        删除</Button>

                    {/*---------------*/}
                </div>
                <div> <Card style={{marginTop:'5px'}}>
                    <Table  bordered rowSelection={rowSelection} columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
                </div></div>
        );
    }
}





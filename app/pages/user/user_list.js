/**
 * Created by kwx on 2017/8/16.
 */

import { getUserList,deleteUsers ,activeUserById,forbidUserById} from '../../ajax/user'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'
import {message,Card,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
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

export default class user_list extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data: [],
            staticData: [],
            deleteIds: [],
            searchText:'',
        }
        let data =this.props.config.WEBDATA.userList;
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
            getUserList(pagination, (res) => {
                //1  有效 0 禁止
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    //this.setState({data:res.data.ucUser,staticData:res.data.ucUser})
                    this.setState({data:res.data.ucUser})
                    this.setState({staticData:res.data.ucUser})
                    console.log(res);
                }else if (res.ospState == 401){
                    message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
                } else {
                    message.warning(res.msg)
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
            this.props.config.WEBDATA.userList = JSON.stringify(data);
        } else {
            this.props.config.WEBDATA='';
        }

    }

    //允许登陆
    allowLogin  = (index) => {
        let data={}
        data.ids =index;
        data.status = status;
        data.pageNo =1;
        data.pageSize = 100000;
        activeUserById(data, (res) => {
            //1  有效 0 禁止
            console.log("++++++" + res);
            if (res.ospState == 200) {
                this.setState({data:res.data.ucUser,staticData:res.data.ucUser})
                console.log(res);
            } else {
                message.warning(res.msg)
            }
        })
    }
    //禁止登陆
    stopLogin  = (index) => {
        let data={}
        data.ids =index;
        data.status = status;
        data.pageNo =1;
        data.pageSize = 100000;
        forbidUserById(data, (res) => {
            //1  有效 0 禁止
            console.log("++++++" + res);
            if (res.ospState == 200) {
                this.setState({data:res.data.ucUser,staticData:res.data.ucUser})
                console.log(res);
            } else {
                message.warning(res.msg)
            }
        })


    }

    //删除
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的用户');
        }else {

            let pagination={}
            pagination.pageNo =1;
            pagination.pageSize = 100000;
            pagination.ids = this.state.deleteIds.toString()
            deleteUsers(pagination, (res) => {
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
                    this.setState({data:res.data.ucUser,staticData:res.data.ucUser})
                    console.log(res);
                }else if (res.ospState == 401){
                    message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
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
    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log("每行"+selectedRows)
        let ids = [];
        selectedRows.map((item)=>{
            ids.push(item.userId)
        })

        this.setState({ selectedRowKeys})
        this.state.deleteIds = ids;
        console.log("userid==="+ this.state.deleteIds)
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            // filterDropdownVisible: false,
            data:  this.state.staticData.map((record) => {
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
    render() {

        const columns = [{
            title: '账号',
            dataIndex: 'userName',
        }, {
            title: 'Email',
            dataIndex: 'userEmail',
        }, {
            title: '登录状态',
            dataIndex: 'status',
            render: (text, record, index) => {
                return (text > 0? ("有效"):("禁止"));
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
        }, {
            title: '最后登陆时间',
            dataIndex: 'lastLoginTime',
        },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = '';
                    record.status > 0 ?(title_action = "禁止"+record.userName+"登陆?"):(title_action = "允许"+record.userName+"登陆?");
                    return (
                        this.state.data.length > 1 ?
                            (
                                record.status > 0 ?
                                    ( <Popconfirm title={title_action} onConfirm={() => this.stopLogin(record.userId)}>
                                            <a href="#">禁止登陆</a>
                                          </Popconfirm>
                                    ):(
                                    <Popconfirm title={title_action} onConfirm={() => this.allowLogin(record.userId)}>
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
            <div style={{height:'80%'}}>
                <div className="custom-filter-dropdown">
                    <Input
                        placeholder="输入账号"
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
                      <Card>
                    <Table  bordered rowSelection={rowSelection} columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                      </Card>
                </div>
        );
    }
}





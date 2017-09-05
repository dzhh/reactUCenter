/**
 * Created by kwx on 2017/8/15.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
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

export default class menu_list extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:this.props.config.DATA,
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
            values.key=values.name;
            //console.log(values);
            console.log(this.state.data);

            this.props.config.DATA.push(values);
            this.setState({data:this.props.config.DATA}) ;
          //  console.log(this.props.config.DATA);
        })

        this.setState({ loading: true });
        //this.setState({ loading: false, visible: false });
         setTimeout(() => {
             this.setState({ loading: false, visible: false });
         }, 3000);
    }
    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false });
    }
     //删除
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的菜单');
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
            data: this.props.config.DATA.map((record) => {
                const match = record.name.match(reg);
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
            title: '名称',
            dataIndex: 'name',
        }, {
            title: 'url',
            dataIndex: 'url',
        }, {
            title: 'icon',
            dataIndex: 'icon',
        }];


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
                placeholder="Search name"
                value={this.state.searchText}
                onChange={this.onInputChange}
                onPressEnter={this.onSearch}
                style={{width: '20%',
                    marginRight: '8px'}}
            />
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
            {/*---------------*/}
            <Button type="primary" onClick={this.showModal}  style={{marginLeft:"10px"}}>
                添加
            </Button>
            <Button type="danger" onClick={this.onDelete}
                    loading={loading}
                    style={{marginLeft:"10px",backgroundColor:'#EE0000',color:'white'}}
            >
                删除</Button>
            <Modal
                visible={this.state.visible}
                title="添加菜单"
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
                    <FormItem label="菜单名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入菜单名称!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="url">
                    {getFieldDecorator('url', {
                        rules: [{ required: true, message: '请输入URL!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                    <FormItem label="icon">
                        {getFieldDecorator('icon', {
                            rules: [{ required: true, message: '请输入icon!' }],
                        })(
                            <Input />
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





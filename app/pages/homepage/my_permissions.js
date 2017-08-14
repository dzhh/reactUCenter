/**
 * Created by kwx on 2017/8/12.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
import moment from 'moment';
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'

@connect(
    (state, props) => ({
        config: state.config,
    }),
    //(dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class my_permissions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            confirmDirty: false,
        }
        this.getPermissions = this.getPermissions.bind(this);
    }

    componentDidMount() {
        console.log(this.props)
    }

     getPermissions(){

         return this.props.config.PERMISSIONS.map((item, index) => {

             <Menu.Item key={item.id}>item.value</Menu.Item>
         })
     }
    render() {

      // console.log(this.getPermissions());
        const menu = (

            <Menu>
                {this.props.config.PERMISSIONS.map((item, index) => {
                   return <Menu.Item key={item.id}> <Icon type="user" />{item.value}</Menu.Item>
                 })
                }
            </Menu>

        );
        {console.log("00000"+menu);}
        return (

            <Dropdown overlay={menu} trigger={['click']} >
                <h3 className="ant-dropdown-link" href="#">
                    <Icon type="user" />系统管理员 <Icon type="down" />
                    <Badge count={6} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
                </h3>
            </Dropdown>

        );
    }

}

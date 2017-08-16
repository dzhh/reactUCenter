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
        this.allPermiession = this.allPermiession.bind(this);
    }

    componentDidMount() {
        console.log(this.props)
    }

     getPermissions(children){
             children.map((item, index) => {
             return <Menu.Item style={{textAlign:'center'}} key={item.id}> <Icon type="user" />{item.value}</Menu.Item>
         })

     }
     allPermiession(all) {
         //return all.map((item, index) => {

             let menu = (
                 <Menu>
                     {all.children.map((item_chileren, index_1) => {
                         return <Menu.Item style={{textAlign:'center'}} key={item_chileren.id}> <Icon type="user" />{item_chileren.value}</Menu.Item>
                     })
                     }
                 </Menu>

             );



             return (
                 <Dropdown overlay={menu} trigger={['click']}>
                     <h1 className="ant-dropdown-link" href="#" style={{textAlign: 'center'}}>
                         <Icon type="user"/>{all.name} <Icon type="down"/>
                         <Badge count={all.count}
                                style={{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}}/>
                     </h1>
                 </Dropdown>

             )


        // })
     }
    render() {

      // console.log(this.getPermissions());
      //   const menu = (
      //
      //       <Menu>
      //           {this.props.config.PERMISSIONS.map((item, index) => {
      //              return <Menu.Item style={{textAlign:'center'}} key={item.id}> <Icon type="user" />{item.value}</Menu.Item>
      //            })
      //           }
      //       </Menu>
      //
      //   );
      //   {console.log("00000"+menu);}

        return (

            this.allPermiession(this.props.config.PERMISSIONS||[])


        )
    }

}

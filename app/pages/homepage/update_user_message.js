/**
 * Created by kwx on 2017/8/11.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input,message, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd'
import moment from 'moment';
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { getUserMessage,updateUserMessage } from '../../ajax/user'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
    }),
    //(dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)

@Form.create({
    onFieldsChange(props, items) {
        // console.log(items)
        // props.cacheSearch(items);
    },
})

export default class update_user_message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            user:{}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log(this.props)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('输入: ', values);
                let user ={};
                user.userId = this.state.user.userId;
                user.userEmail = values.userEmail;
                updateUserMessage(user, (res) => {
                    console.log("++++++"+res);
                    if (res.ospState == 200) {
                        //this.setState({ user: res.data.ucUser})
                        //hashHistory.push('/updateUserMessage')
                        message.success("修改成功")

                    } else {
                        message.warning(res.msg)
                    }
                })
                //hashHistory.push('/homePage')

            }
        });
    }

    componentWillMount(){
        const user={};
        // user.token = sessionStorage.getItem("token");
        user.userName = sessionStorage.getItem('userName')
        user.userId = sessionStorage.getItem('userId')
        console.log("===============update_user_message  componentWillMount=================================")
        getUserMessage(user, (res) => {
            console.log("++++++"+res);
            if (res.ospState == 200) {
                this.setState({ user: res.data.ucUser})
            } else {
                message.warning(res.msg)
            }
        })
    }


    componentDidMount() {
        console.log("===============update_user_message  componentDidMount=================================")
    }

    componentWillUnmount() {
        console.log("===============update_user_message  componentWillUnmount=================================")
    }


    render(){
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };

        const user = this.state.user;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                {...formItemLayout}
                label="账号(不可修改)"
                >
                <Input value={user.userName} disabled />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                     label="e-mail"
                     hasFeedback>
                    {getFieldDecorator('userEmail', {
                        rules: [{
                            type: 'email', message: '请输入正确的email!',
                        }, {
                            required: true, message: 'E-mail不能为空!',
                        }],
                    })(
                        <Input placeholder="请输入新的e-mail" defaultValue={user.userEmail} />
                    )}

                </FormItem>



                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="创建时间"*/}
                    {/*>*/}
                        {/*<Input value={user.createTime} disabled />*/}
                    {/*</FormItem>*/}

                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="最后登录时间"*/}
                    {/*hasFeedback*/}
                {/*>*/}
                    {/*<Input value={user.lastLoginTime} disabled/>*/}


                {/*</FormItem>*/}




                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">修改</Button>
                </FormItem>
            </Form>
        );
    }


}

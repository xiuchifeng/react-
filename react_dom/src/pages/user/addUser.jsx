import { Form, Select, Input, } from 'antd';
import React, { Component } from 'react'

const { Option } = Select;
export class addUser extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;//用来收集表单数据  
        const formItemLayout = {
            labelCol: {     //文字占据的比例
                sm: { span: 6 },
            },
            wrapperCol: {  //组件标签占据的比例
                sm: { span: 12 },
            },
        };
        let { roles, user } = this.props
        user = user||{}
        return (
            <Form {...formItemLayout}>

                <Form.Item label={'用户名'}>
                    {
                        getFieldDecorator('username', {
                            rules: [
                                { required: true, message: '用户名不能为空' },
                                {min:3,message:"你太短了"},
                                    {max:12,message:"太长顶不住了!"},
                                    {required:true,message:"宁必须拥有姓名"}
                            ],
                            initialValue: user.username
                        })(
                            <Input placeholder='请输入用户名称' />
                        )
                    }

                </Form.Item>
                <Form.Item label={'密码'}>
                    {
                        getFieldDecorator('password', {
                            rules: [
                                { required: true, message: '密码不能为空' }
                            ],
                            initialValue: user.password
                        })(
                            <Input placeholder='请输入用户密码' />
                        )
                    }

                </Form.Item>
                <Form.Item label={'手机号'}>
                    {
                        getFieldDecorator('phone', {
                            rules: [
                                { required: true, message: '手机号不能为空' }
                            ],
                            initialValue: user.phone
                        })(
                            <Input placeholder='请输入用户手机号' />
                        )
                    }

                </Form.Item>
                <Form.Item label={'角色'}>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id
                        })(    //收集的Option的value值
                            <Select>
                                {
                                    roles.map(item => {
                                        return <Option
                                            key={item._id}
                                            value={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create({})(addUser);
import React, { Component } from 'react'
import { Form, Icon, Input, Button,message } from 'antd';
import {reqLogin} from "../../api"
import "./login.css"

const StorageUtils=()=>import("../../utils/storageutils")
class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();//阻止默认事件
        this.props.form.validateFields(async (err, values) => {   //校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
	            if (!err) {//成功登录时
		            console.log('用户信息:', values);
		            const result=await reqLogin(values);
		            console.log(result);
		            const {msg,status,data}=result
		            if(status===0){
                        message.success(`${msg}`);
                        StorageUtils.saveUser(data);
                        this.props.history.push(`/admin/home`)
            }else{
                message.error(`${msg}`);
            }
          }
        });
       
      };
      
    render() {   
       const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-form">
               <h2 className="login-title">REACT后台管理系统</h2>
               <Form >
                    <Form.Item >
                        {
                            getFieldDecorator("username",{
                                rules:[
                                    {min:3,message:"?你好短"},
                                    {max:12,message:"太长顶不住了!"},
                                    {required:true,message:"宁必须拥有姓名"}
                                ]       
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入用户名"
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item >            
                    {
                            getFieldDecorator("password",{
                                rules:[
                                    {required:true,message:"宁必须填密码"}
                                ]
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item >
                    <Button type="default" htmlType="submit" className="login-form-button"  onClick={this.handleSubmit} block>
                        登录
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        )

    }
}
const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm;

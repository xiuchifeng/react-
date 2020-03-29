import React, { Component } from 'react'
import { Form, Input, } from 'antd';

export  class updatCategory extends Component {
    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item>
                {getFieldDecorator('categoryName', {
                    rules: [{ required: true, message: '请输入分类名称' }],
                })(<Input placeholder="请输入分类名称"/>)}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create({})(updatCategory);

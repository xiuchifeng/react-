import { Form, Select, Input, } from 'antd';
import React, { Component } from 'react'


const { Option } = Select;

export  class addCategory extends Component {
    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;//用来收集表单数据  
        const {categories}=this.props
        return (
            <Form>
                <Form.Item>
                {getFieldDecorator('parentId', {
                    initialValue:"0"
                })(
                    <Select>
                        <Option value="0">一级分类</Option>
                        {categories.map(item=>{
                            return <Option value={item._id}
                            key={item._id}>
                            {item.name}
                            </Option>
                            })    
                        }
                    </Select>,
                )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('categoryName', {
                    rules: [{ required: true, message: '请输入分类名称' }],
                })(<Input placeholder="请输入分类名称"/>)}
                </Form.Item>
            </Form>
        )
    }
}
export default Form.create({})(addCategory);

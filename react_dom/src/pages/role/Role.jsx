import React, { Component } from 'react'
import {
    Card,
    Input,
    Button,
    Table,
    message,
    Modal,
    Form,
} from "antd"
import {PageSize} from "../../init/init"
import { reqAddrole, reqRoles } from "../../api"
import {reqUpdateRole,reqRemoveRole} from "../../api/index"
import storageutils from "../../utils/storageutils"
import UpdateRole from "./updateRole"
export default class Role extends Component {
    constructor(props){
        super(props)
        this.menus = React.createRef()
    }
    state = {
        addvisible: false,
        loading: true,
        roles: [],  //存放所有角色
        role:[],    //存放角色
        selectedRowKeys:[],
        showUpdate:false,

    }
    UNSAFE_componentWillMount() {
        this.getRoles()
    }
    columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (create_time) => {
                return new Date(create_time).toLocaleString()
            }
        },
        {
            title: '授权时间',
            dataIndex: 'auth_time',
            render: (auth_time) => {
                return new Date(auth_time).toLocaleString()
            }
        },
        {
            title: '授权人',
            dataIndex: 'auth_name',
        }
    ];

    getRoles = async () => {
        const result = await reqRoles()
        console.log(result);
        const { data, msg, status } = result;
        if (status === 0) {
            this.setState({
                loading: false,
                roles: data
            })
            message.success(msg)
        }
    }
    addRole = e => {
        this.form.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading:true
                })
                const result = await reqAddrole(values)
                const {  msg, status } = result;
                if (status === 0) {
                    this.getRoles()
                    message.success(msg)
                    this.setState({
                        addvisible: false
                    })
                } else {
                    message.error(msg)
                }
            }
        })
    }
    updateRole=async ()=>{
        const {role}=this.state;
        const user = storageutils.getUser()
        role.auth_time =new Date()
        role.menus = this.menus.current.state.checkedKeys
        role.auth_name = user.username
        console.log(user,role);
        
        const result=await reqUpdateRole(role)
        const {status,msg,data}=result
        if(user.role_id===role._id){
            message.success('登录用户的权限已经修改')
            storageutils.removeUser()
            this.props.history.replace('/login')
        }else if(status===0){
            message.success(msg)
            this.setState({
                showUpdate:false
            })
            this.getRoles()
        }else{
            message.error(msg)
            console.log(data);         
        }

    }
    removeRole=async ()=>{
        const {selectedRowKeys}=this.state
        const result=await reqRemoveRole(selectedRowKeys)
        const {status,msg}=result;
        if(status===0){
            this.getRoles()
            message.success(msg)    
        }else{
            message.error(msg)
        }
    }
    onRow=role=>({
       onClick:()=>{
        this.setState({
            selectedRowKeys:role._id,
            role:role
        })
        console.log(this.state.role);
    }
    })
    handleCancel = () => {
        this.setState({
            addvisible: false,
            showUpdate:false
        })
    }
    render() {
        const { roles, loading,selectedRowKeys,role} = this.state
        const title = (
            <span>
                <Button type='primary' icon={'plus'} onClick={() => { this.setState({ addvisible: true }) }}>添加角色</Button>
                <Button type='primary' style={{ margin: 10 }} disabled={!role._id} onClick={() => { this.setState({ showUpdate: true }) }}>设置角色权限</Button>
                <Button type='primary' icon={'delete'} onClick={this.removeRole}>删除角色</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={roles}  //数据源
                    columns={this.columns}       //每列的信息
                    rowKey='_id'        //必须要有的
                    loading={loading}      //设置数据是否在加载中
                    bordered
                    pagination={{ defaultPageSize: PageSize }}    //配置分页器
                    rowSelection={{
                        type: "radio",
                        selectedRowKeys:selectedRowKeys,
                        }
                    }
                    onRow={this.onRow}
                />;
                <Modal
                    title="请添加角色"
                    visible={this.state.addvisible}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddRole wrappedComponentRef={(form) => this.form = form} />
                </Modal>
                <Modal
                    title="请修改角色"
                    visible={this.state.showUpdate}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel}
                >
                    <UpdateRole ref={this.menus} role={role}/>
                </Modal>
            </Card>
        )
    }
}
class AddRole extends Component {
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('roleName', {
                            rules: [
                                { required: true, message: '角色名不能为空' }
                            ]
                        })(
                            <Input placeholder='请输入角色名称' />
                        )
                    }

                </Form.Item>
            </Form>
        )
    }
}
AddRole = Form.create()(AddRole);

import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    message,
    Modal,
} from "antd"
import AddUser from "./addUser"
import MyButton from "../../commponents/mybutton/MyButton"
import { reqRoles, reqAdduser, reqUsers ,reqUpdateUser,reqRemoveUser} from "../../api"
import {PageSize} from "../../init/init"
const { confirm } = Modal;
export default class User extends Component {
    state = {
        showvisible: false,
        loading: true,
        roles: [],
        users: [],
        roleName: {}//{角色id:角色名}
    }
    UNSAFE_componentWillMount() {
        this.getData()
    }
    getData = async () => {
        const result = await Promise.all([reqUsers(), reqRoles()])
        this.setState({
            users: result[0].data,
            roles: result[1].data,
            loading:false
        })
        this.initRoles()
    }
    initRoles = () => {
        // console.log(this.state.roles)
        const roleName = this.state.roles.reduce((pre, next) => {
            pre[next._id] = next.name
            return pre
        }, {})
        this.setState({ roleName })
    }
    addUser = () => {
        this.form.props.form.validateFields(async (err, values) => {
            if (!err) {
                let result
                if(this.user){
                    values._id=this.user._id;
                    result = await reqUpdateUser(values)
                }else{
                    result = await reqAdduser(values)
                }
                const {  msg, status } = result
                if(status===0){ //如果添加用户成功  从数据库中获取所有的用户  展示在页面中
                    this.getData()
                    message.success(msg)
                    this.form.props.form.resetFields()
                    this.setState({showvisible: false});
                }else{
                    message.error(msg)
                }

            }
        })
    }
    showUpdate = user => {
        console.log(user);
        
        this.user=user
        this.setState({showvisible:true})
    }
    showDeleteConfirm= user =>{
        confirm({
          title: '你确定要删除用户吗?',
          content: '删了无法恢复的哦',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk:async ()=> {
            const result =await reqRemoveUser(user);
            console.log(result);
            const {status,msg}=result;
            if(status===0){
                this.setState({loading:true})
                this.getData()
                message.success(msg)
            }else{
                message.error(msg)
            }
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
    handleCancel = () => {
        this.setState({
            showvisible: false,
        })
    }
    columns = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (create_time) => new Date(create_time).toLocaleString()
        },
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '所属角色',
            dataIndex: 'role_id',   //角色id  roleName = {角色id:角色name}

            render: (role_id) => {
                return this.state.roleName[role_id]
                // return this.state.roles.find(item=>item._id===role_id).name
            }
        },
        {
            title: '操作',
            width: 300,
            render: (user) => {
                // console.log(a);//render函数的参数 是对应行的数据源
                return (
                    <span>
                        <MyButton onClick={() => this.showUpdate(user)}>修改用户</MyButton>
                        <MyButton onClick={() => this.showDeleteConfirm(user)}>删除用户</MyButton>
                    </span>
                )
            }
        }
    ]
    render() {
        const { roles, users ,loading} = this.state
        const title = (
            <span>
                <Button type='primary' icon={'plus'} onClick={() => { this.setState({ showvisible: true }) }}>添加用户</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={users}  //数据源
                    columns={this.columns}       //每列的信息
                    rowKey='_id'        //必须要有的
                    loading={loading}      //设置数据是否在加载中
                    bordered
                    pagination={{ defaultPageSize: PageSize }}    //配置分页器
                />
                <Modal
                    title={this.user?"请修改用户":"请添加用户"}
                    visible={this.state.showvisible}
                    onOk={this.addUser}
                    onCancel={this.handleCancel}
                >
                    <AddUser
                        wrappedComponentRef={(form) => this.form = form}
                        roles={roles}
                        user={this.user}
                    />
                </Modal>
            </Card>
        )
    }
}

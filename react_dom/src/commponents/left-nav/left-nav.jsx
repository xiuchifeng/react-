import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd';
import { NavLink, withRouter } from 'react-router-dom'
import { reqRole } from "../../api/index"

const storageutils=()=>import("../../utils/storageutils")
const menusconfig=()=>import("../../config/menusConfig")
const { Sider } = Layout;
const { SubMenu } = Menu;
class leftnav extends Component {
    state={
        menus:[]
    }
    componentDidMount(){
        this.getRoleMenus()
    }
    getRoleMenus = async () => {
        this.user = storageutils.getUser();
        if(this.user.role_id){
            const result = await reqRole(this.user.role_id)
            this.user.menus=result.data
            this.setState({
                menus:this.getMenus(menusconfig)
            })
        }else{
            this.setState({
                menus:this.getMenus(menusconfig)
            })
        }          
    }
    hasAuth = (item)=>{
        // console.log(this.roleAuth)  // ['/admin/category']
      if(this.user.username==="admin"||item.public||this.user.menus.includes(item.key)){
          return true
      }else if(item.children){
        return item.children.find(cItem=>this.user.menus.includes(cItem.key))
      }else{
          return false
      }

    }
    getMenus = (menus) => {
        const { pathname } = this.props.location
            return menus.map(item=> {
                if(this.hasAuth(item)){
                    if (item.children) {
                        const result = item.children.filter(cItem => pathname === cItem.key)
                        if (result.length) {  //如果在有children的数组中找到了匹配pathname的key值
                            this.defaultOpenKeys = item.key
                        }
                        return <SubMenu
                            key={item.key}
                            title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}
                        >
                            {this.getMenus(item.children)}
                        </SubMenu>
                    } else {
                        return <Menu.Item key={item.key}>
                            <NavLink to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </NavLink>
                        </Menu.Item>
                    }
                }
            })
    }
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };
    render() {
        const { pathname } = this.props.location
        return (
            <Sider>
                <Menu
                    defaultSelectedKeys={pathname}
                    defaultOpenKeys={[this.defaultOpenKeys]}
                    mode="inline"
                    theme="dark"
                >
                    {this.state.menus}
                </Menu>
            </Sider>

        )
    }
}
export default withRouter(leftnav)
//如何让非路由组件 具有路由组件的三个属性 history location match
//使用withRouter 高阶组件

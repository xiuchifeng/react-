import React, { Component } from 'react'
import {Redirect,Switch,Route} from "react-router-dom"
import { Layout, } from 'antd';

const StorageUtils=()=>import("../../utils/storageutils")
const LeftNav=()=>import("../../commponents/left-nav/left-nav")
const Header=()=>import("../../commponents/header/header")
const Home=()=>import("../home/Home")
const Category=()=>import("../category/Category")
const Product=()=>import("../product/Product")
const User=()=>import("../user/User")
const Role=()=>import("../role/Role")
const Bar=()=>import("../charts/Bar")
const Line=()=>import("../charts/Line")
const Pie=()=>import("../charts/Pie")

//所有的import关键词必须在整个文件的最前面
const { Footer,Content} = Layout;

export default class admin extends Component {
    state = {
        collapsed: false,
      };
      onCollapse = collapsed => {
        this.setState({ collapsed });
      };
    UNSAFE_componentWillMount(){
    }
    render() {
         const user= StorageUtils.getUser()
        console.log(document.body.offsetHeight,123456);
        if(!user._id){
            //也可以用  this.props.history.push("/login")
            return <Redirect to="/login"/>
        }
        return (
                <Layout style={{height:"100%"}}>                   
                        <LeftNav></LeftNav>
                    <Layout>
                        <Header/>
                        <Content >
                        <Switch>
                            <Route path='/admin/home' component={Home}/>
                            <Route path='/admin/category' component={Category}/>
                            <Route path='/admin/product' component={Product}/>
                            <Route path='/admin/user' component={User}/>
                            <Route path='/admin/role' component={Role}/>
                            <Route path='/admin/charts/bar' component={Bar}/>
                            <Route path='/admin/charts/line' component={Line}/>
                            <Route path='/admin/charts/pie' component={Pie}/>
                        </Switch>
                        </Content>
                        <Footer style={{ textAlign: 'center',bottom:"0px"}}>王洽肥 备案/许可证编号为：苏ICP备19073597号  2019-12-19</Footer>
                    </Layout>
                </Layout>
           
        )
    }
}

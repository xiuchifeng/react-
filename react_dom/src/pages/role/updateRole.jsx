import React, { Component } from 'react'
import { Tree, Form,Input } from 'antd';
import menusConfig from "../../config/menusConfig"
const { TreeNode } = Tree;
const { Item } = Form;
export default class updateRole extends Component {
    state = {
          // checkedKeys 设置复选框是否选中    selectedKeys 设置文字是否选中
        checkedKeys:this.props.role.menus, //存放的角色的权限信息
    }
    UNSAFE_componentWillMount(){
        this.treeNodes=this.getTreeNodes(menusConfig)
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        // console.log(nextProps)
        const {menus} = nextProps.role
        this.setState({checkedKeys:menus})
    }
    getTreeNodes = (menusConfig)=>{
        return menusConfig.reduce((pre,next)=>{
            if(next.children){
                pre.push(
                    <TreeNode title={next.title} key={next.key}>
                        {this.getTreeNodes(next.children)}
                    </TreeNode>
                )
            }else{  //如果没有子节点的
                pre.push( <TreeNode title={next.title} key={next.key}  />)
            }
            return pre
        },[])
    }
   
    onCheck = (checkedKeys, info) => {
        this.setState({
            checkedKeys
        })
        
    };
    
    render() {
        const {role} = this.props
        return (
            <Form title="角色名称">
                <Item>
                    <Input disabled placeholder={role.name}></Input>
                    <Tree
                        checkable
                        defaultExpandAll={true}
                        checkedKeys={this.state.checkedKeys}
                        onCheck={this.onCheck}
                    >
                        {this.treeNodes}
                    </Tree>
                </Item>
            </Form>
        )
    }
}

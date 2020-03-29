import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message,
} from "antd"
import {PageSize} from "../../init/init"
import {reqProducts,reqSearchProducts,reqRemoveProduct} from "../../api/index"
import MyButton from "../../commponents/mybutton/MyButton"
const {Option}=Select
export default class HomeProduct extends Component {
    state={
        products:[],    //存放所有的商品列表
        total:0,    //商品的总数
        keywords:'',    //搜索关键词
        searchType:'name',   //储存的是搜索类型  默认是按名称搜索
    }
    columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
        },
        {
            title: '商品价格',
            dataIndex: 'price',
            render:(price)=>`￥${price}元`
        },
        {
            title: '操作类型',
            width:300,
            render:(product)=>{
                // console.log(a);//render函数的参数 是对应行的数据源
                // console.log(product)
                return (
                    <span>
                        <MyButton onClick={()=>this.props.history.push({
                            pathname:'/admin/product/detail',
                            state:{
                                product
                            }
                        })}>详情</MyButton>
                        <MyButton onClick={()=>this.props.history.push({
                            pathname:'/admin/product/addUpdate',
                            state:{
                                product
                            }
                        })}>修改</MyButton>
                         <MyButton onClick={() => this.removeProduct(product)}>删除</MyButton>
                    </span>
                )
            }

        }

    ];
    removeProduct=async (product)=>{
        const result = await reqRemoveProduct(product)
        const { status, msg, } = result
        if (status === 0) {
            message.success(msg)
            this.getProducts(1)
        } else {
            message.error(msg)
        }
    }
    componentDidMount(){
        //获取第一页的商品数据
        this.getProducts(1)
    }
    getProducts=async (page)=>{
        const {keywords,searchType,}=this.state
        let result=null
        if(keywords){
            result=await reqSearchProducts(page,PageSize,searchType,keywords)
        }else{
            result =await reqProducts(page,PageSize)
        }
        const {status,data,msg}=result
        if(status===0){
            this.setState({
                products:data.arr,
                total:data.total
            })
            message.success(msg)
        }else{
            message.error(msg)
        }
    }
    render() {
        const {products,total,keywords,searchType} = this.state
        const title=(
            <span>
                <Select value={searchType} style={{width:200}} onChange={(value)=>this.setState({searchType:value})}>
                    <Option value="name">按名称搜索</Option>
                    <Option value="desc">按描述搜索</Option>
                </Select>
                <Input 
                    placeholder="请输入搜索内容" 
                    style={{width:200,margin:10}}
                    value={keywords}
                    onChange={(e)=>this.setState({
                        keywords:e.target.value
                    })}
                    />
                <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/admin/product/addUpdate')}>
                <Icon type='plus'/>
                <span>添加商品</span>
            </Button>
        )
        return (
            
            <Card title={title} extra={extra}>
                 <Table
                    dataSource={products}  //数据源
                    columns={this.columns}       //每列的信息
                    rowKey='_id'        //必须要有的

                    bordered
                    pagination={{ //配置分页器
                        total,  //6
                        defaultPageSize:PageSize,
                        onChange:this.getProducts
                    }}
                />;
            </Card>   
        )
    }
}

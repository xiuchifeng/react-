import React, { Component } from 'react'
import {
    Card,
    Icon,
    List,
} from 'antd'
import Mybutton from "../../commponents/mybutton/MyButton"
import {reqCategoryInfo} from '../../api/index'
import "./detail.less"
import {BASE_URL} from "../../init/init"
const {Item} = List

export default class DetailProduct extends Component {
    state = {
        name1:'',
        name2:''
    }
    componentDidMount(){
        this.getCategory()
    }

    getCategory = async ()=>{
        const {categoryId,pCategoryId} = this.props.location.state.product
        // const result1 = await reqCategoryInfo(pCategoryId)
        // const result2 = await reqCategoryInfo(categoryId)
        if(pCategoryId==='0'){
            const result = await reqCategoryInfo(categoryId)
            this.setState({
                name1:result.data.name,
            })
        }else{
            const result = await Promise.all([reqCategoryInfo(pCategoryId),reqCategoryInfo(categoryId)])
            this.setState({
                name1:result[0].data.name,
                name2:result[1].data.name,
            })
        }

    }
    render() {
        const title = (
            <span>
                <Mybutton onClick={this.props.history.goBack}>
                    <Icon type="arrow-left" />
                </Mybutton>
                <span>商品详情页面</span>
            </span>
        )
        const {desc,details,imgs,name,price} = this.props.location.state.product
        const {name1,name2} = this.state
        return (
            <Card title={title}>
                <List
                    size="large"
                    bordered
                >
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span className='right'>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span className='right'>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span className='right'>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>商品分类：</span>
                        <span className='right'>
                            {name2?name1+'-->'+name2:name1}
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span className='right'>
                            {
                                imgs.map((item,index)=><img
                                    key={index}
                                    className='product-img'
                                    src={BASE_URL+item}
                                    alt=""/>)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:details}}/>
                    </Item>
                </List>
            </Card>
        )
    }
}

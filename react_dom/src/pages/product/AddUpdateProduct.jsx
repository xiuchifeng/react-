import React, { Component } from 'react'
import {
    Card,
    Input,
    Button,
    Icon,
    Form,
    Cascader,
    message,
} from 'antd'
import { reqCategory, reqAddProduct, reqUpdateProduct } from "../../api"

const Mybutton=()=>import("../../commponents/mybutton/MyButton")
const PictureWall=()=>import("./PicturesWall ")
const RichTextEditor=()=>import("./RichTextEditor")

const { TextArea } = Input;
export class AddUpdateProduct extends Component {
    constructor(props) {
        super(props)
        this.imgs = React.createRef();//创建标记对象 {current:null}
        this.details = React.createRef()
    }
    state = {
        options: [],
    };
    UNSAFE_componentWillMount() {
        if (this.props.location.state) {   //如果有值 就是修改页面
            this.update = true
            this.product = this.props.location.state.product
        } else {
            this.update = false
            this.product = {}
        }
    }
    componentDidMount() {
        this.getCategories()
    }
    // onChange=(value,selectedOptions)=>{
    //     console.log(value,selectedOptions);
    // }

    getCategories = async () => {
        const result = await reqCategory("0")
        const { status, data, } = result
        const { pCategoryId } = this.product
        const options = this.forisLeaf(data, false)
        if (status === 0) { //如果获取分类成功
            //如果是修改页面  并且分类的数组长度是2
            if (this.update && pCategoryId !== '0') {
                const targetOption = options.find(item => item.value === pCategoryId)

                const index = options.findIndex(item => item.value === targetOption.value)
                const result = await reqCategory(targetOption.value)
                let { data, status } = result
                if (status === 0) { //如果获取到二级分类
                    // data = this.formateData(data,false)
                    targetOption.children = this.forisLeaf(data, false)
                } else {  //如果没有获取到二级分类 则该一级分类就是叶子
                    targetOption.isLeaf = true;
                }
                options[index] = targetOption
            }
            this.setState({ options })
        } else {
            message.error("获取失败")
        }
    }
    //点击第一级选项时 触发
    forisLeaf = (data, bool) => {
        return data.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: bool
        }))
    }
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        const result = await reqCategory(targetOption.value)
        targetOption.loading = false;
        setTimeout(() => {
            const { data, status } = result;
            if (status === 0) {
                targetOption.children = this.forisLeaf(data, true)
                this.setState({
                    options: [...this.state.options]
                })
            } else {
                targetOption.isLeaf = true
            }
        }, 100)

    };
    handlesubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const imgs = this.imgs.current.getImgs()
                const details = this.details.current.getdetails()
                const { name, desc, price, category } = values
                let categoryId, pCategoryId
                if (category.length === 1) {    //如果收集的长度为的数组
                    // pCategoryId = '0'
                    // categoryId = category[0]
                    [categoryId, pCategoryId = '0'] = category
                } else {
                    // pCategoryId = category[0]
                    // categoryId = category[1]
                    [pCategoryId, categoryId] = category
                }
                const productInfo = { name, desc, price, pCategoryId, categoryId, imgs, details }
                console.log("是否修改",this.update);
                
                if (this.update) {
                    productInfo._id = this.product._id
                    const result = await reqUpdateProduct(productInfo)
                    const { status, msg } = result;
                    if (status === 0) {
                        message.success(msg)
                        this.props.history.push("/admin/product")
                    } else {
                        message.error(msg)
                    }
                }else{
                    const result = await reqAddProduct(productInfo)
                    const { status, msg } = result;
                    if (status === 0) {
                        message.success(msg)
                        this.props.history.push("/admin/product")
                    } else {
                        message.error(msg)
                    }
                }
            }
        });

    }
    render() {
        const { categoryId, desc, details, imgs, name, pCategoryId, price } = this.product
        const { getFieldDecorator } = this.props.form
        const category = []
        if (pCategoryId === '0') {  //如果是一级分类
            category.push(categoryId)
        } else {
            category.push(pCategoryId, categoryId)
        }
        const title = (
            <span>
                <Mybutton onClick={this.props.history.goBack}>
                    <Icon type="arrow-left" />
                </Mybutton>
                <span>{this.update ? "修改商品页面" : "添加商品页面"}</span>
            </span>
        )

        const formItemLayout = {
            labelCol: {     //文字占据的比例
                sm: { span: 5, offset: 1 },
            },
            wrapperCol: {  //组件标签占据的比例
                sm: { span: 12 },
            },
        };
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Form.Item label={"商品名称"}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '商品名称不能为空' }],
                            initialValue: name
                        })(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </Form.Item>
                    <Form.Item label={"商品描述"}>
                        {getFieldDecorator('desc', {
                            rules: [{ required: true, message: '商品描述不能为空' }],
                            initialValue: desc
                        })(
                            <TextArea placeholder="请输入商品描述" />
                        )}
                    </Form.Item>
                    <Form.Item label={"商品价格"}>
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: '商品价格不能为空' }],
                            initialValue: price
                        })(
                            <Input type="number" min={2} placeholder="请输入商品价格" addonAfter="元" />
                        )}
                    </Form.Item>
                    <Form.Item label={"商品分类"}>
                        {getFieldDecorator('category', {
                            rules: [{ required: true, message: "不能为空" }],
                            initialValue: category
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                onChange={this.onChange}
                                changeOnSelect
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={"商品图片"}>
                        <PictureWall ref={this.imgs} imgs={imgs} />
                    </Form.Item>
                    <Form.Item label={"商品详情"}>
                        <RichTextEditor ref={this.details} details={details} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.handlesubmit}>提交</Button>
                    </Form.Item>
                </Form>
            </Card>

        )
    }
}
export default Form.create({})(AddUpdateProduct);

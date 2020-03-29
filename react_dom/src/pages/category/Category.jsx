import React, { Component } from 'react'
import { Card, Icon, Button, Modal, message, Table,  } from 'antd';
import { reqAddCategory, reqCategory, reqUpdateCategory, reqRemoveCategory } from "../../api/"
import {PageSize} from "../../init/init"

const AddCategory=()=>import("./addCategory")
const UpdatCategory=()=>import("./updatCategory")
const MyButton=()=>import("../../commponents/mybutton/MyButton")
export default class content extends Component {
    state = {
        addvisible: false,
        updatevisible: false,
        categories: [],
        loading: true,
        parentId: '0',
        parentName: "",
        subCategorys: [],
        updateId: '',
    }
    componentDidMount() {
        this.getCategories()
    }
    columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
        },
        {
            title: "操作",
            width: 300,
            render: (data) => {     //对应行的数据源
                const parentId = this.state.parentId
                if (parentId==="0") {
                    return <span>
                        <MyButton onClick={() => this.showupdate(data)}>修改分类名</MyButton>
                        <MyButton onClick={() => this.showSubCategory(data)}>查看子分类</MyButton>
                        <MyButton onClick={() => this.removeCategory(data)}>删除分类</MyButton>
                    </span>
                } else {
                    return <span>
                        <MyButton onClick={() => this.showupdate(data)}>修改分类名</MyButton>
                        <MyButton onClick={() => this.removeCategory(data)}>删除分类</MyButton>
                        <MyButton onClick={this.showCategory}>返回上级</MyButton>
                    </span>
                }
            }

        }

    ];
    //展示添加分类界面
    showAdd = (category) => {
        this.category = category;
        console.log(this.category);


        this.setState({
            addvisible: true,
        })
    }
    setForm = (form) => {//获取子组件的form数据
        this.form = form;
    }
    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                values._id = this.category._id
                console.log(values);

                const result = await reqAddCategory(values)
                const { status, msg } = result
                if (status === 0) {
                    //在显示二级分类面板中 添加新的一级分类
                    if (values.parentId === this.state.parentId) {  //如果下拉框收集的parentId和组件的parentId相等
                        this.getCategories()
                    } else if (values.parentId === '0') { //如果下拉框收集的parentId 是 '0' 表示新增一个一级分类
                        this.getCategories('0')
                    }
                    this.setState({
                        addvisible: false
                    })
                    message.success(msg)
                } else {
                    message.error(msg)
                }
            }
        })
        this.form.resetFields()
    }
    handleCancel = e => {
        console.log('cancel')
        this.setState({
            addvisible: false,
            updatevisible: false
        });
        this.form.resetFields()
    };
    showupdate = category => {
        console.log("修改分类");
        console.log(category);

        this.category = category
        this.setState({
            updatevisible: true,
        });
    }
    updateCategory = e => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { _id, parentId } = this.category
                const { categoryName } = values
                values._id = _id
                if (categoryName === undefined) {
                    message.error("你卖空气吗弟弟")
                    return
                }
                const result = await reqUpdateCategory(values)
                const { status, msg } = result;
                if (status === 0) {
                    this.setState({
                        updatevisible: false,
                        parentId: parentId
                    })
                    message.success(msg)
                    this.getCategories()
                } else {
                    message.error(msg)
                }
            }

        })
        this.form.resetFields()
    }
    removeCategory = async (category) => {
        const result = await reqRemoveCategory(category)
        const { status, msg, } = result
        if (status === 0) {
            this.getCategories()
        } else {
            message.error(msg)
        }
    }
    getCategories = async (parentId) => {
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategory(parentId)
        this.setState({ loading: false })
        const { status, msg, data, } = result
        if (status === 0) { //如果获取分类成功
            if (parentId === "0") {     //如果获取的是一级分类
                this.setState({ categories: data })
            } else {                  //如果获取的是子分类
                this.setState({ subCategorys: data })
            }
        } else {
            if (parentId === "0") {     //如果获取的是一级分类
                this.setState({ categories: data })
            } else {                  //如果获取的是子分类
                this.setState({ subCategorys: data })
            }
            message.error(msg)
        }
    }
    showSubCategory = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategories()
        })
    }
    showCategory = () => {
        this.setState({
            parentId: "0",
            parentName: "",
            subCategorys: []
        }, () => {
            this.getCategories()
        })
    }
    render() {
        const { categories, loading, subCategorys, parentId, parentName } = this.state
        const title = parentId === "0" ? "一级分类" : (
            <span>
                <MyButton onClick={this.showCategory}>一级分类</MyButton>
                <Icon type="arrow-right" />
                {parentName}
            </span>
        )
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type="plus" />
                <span>添加分类</span>
            </Button>
        )
        return (
            <Card title={title} extra={extra} style={{ width: "100%" }}>
                <Table
                    dataSource={parentId === '0' ? categories : subCategorys}  //数据源
                    columns={this.columns}       //每列的信息
                    rowKey='_id'        //必须要有的
                    loading={loading}      //设置数据是否在加载中
                    bordered
                    pagination={{ defaultPageSize: PageSize }}    //配置分页器
                />;
                <Modal
                    title="请添加分类"
                    visible={this.state.addvisible}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddCategory setForm={this.setForm} categories={categories} />
                </Modal>
                <Modal
                    title="修改分类名"
                    visible={this.state.updatevisible}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdatCategory setForm={this.setForm} />
                </Modal>

            </Card>
        )
    }
}



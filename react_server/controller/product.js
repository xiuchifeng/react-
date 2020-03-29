const fs =require("fs")
const path =require("path")
const products = require('../schema/productShema')
exports.imgUpload=cxt=>{
   const {filename}=cxt.req.file
   console.log(filename,123);
   
    cxt.body={
        status:0,
        msg:"图片上传成功",
        data:{
            name:filename,
            url:`http://localhost:5000/uploads/${filename}`
        }
    }
}
exports.imgDelete=cxt=>{
    const {name}=cxt.request.body
    const filename=path.join(__dirname,"../public/uploads",name)
    fs.unlinkSync(filename)
    cxt.body={
        status:0,
        msg:"图片删除成功"
    }    
}
exports.addProduct=async cxt=>{
    const {name}=cxt.request.body
    const result = await products.findOne({name})
    if(result){   //如果找到了 就提示商品名称重复
        cxt.body = {
            status: 1,
            msg: '该商品名称重复'
        }
    } else {      //如果没有找到该商品 就添加该商品
        const product = await products.create(cxt.request.body)
        cxt.body = {
            status: 0,
            data: product,
            msg: '添加商品成功',
        }
    }
}
exports.getProducts=async cxt=>{
    const {page,pagesize}=cxt.query
    const result = await products.find()
    //也可以用 const result = await Products.find().skip(start).limit(num)获取数据

    const arr=result.slice(page*pagesize-3,page*pagesize)
    //也可以用const total = await Products.find().countDocuments()获取总页数

    const total=await products.find().countDocuments()
    cxt.body={
        status:0,
        data:{arr,total,},
        msg:"获取商品信息成功"
    }
}
exports.searchProducts=async cxt=>{
    const {page,pagesize,searchtype,keyword}=cxt.query
    let arr,total
    if(searchtype==="name"){
        arr=await products.find({name:new RegExp(keyword)})
        total = await products.find({name:new RegExp(keyword)}).countDocuments()
    }else{
        arr=await products.find({desc:new RegExp(keyword)})
        total = await products.find({desc:new RegExp(keyword)}).countDocuments()
    }

    if(total===0){
         cxt.body={
            status:1,
            data:{arr,total,},
            msg:"获取商品信息失败"
        }
    }else{
         cxt.body={
            status:0,
            data:{arr,total},
            msg:"获取商品信息成功"
    }
    }
   
    
}
exports.updateProduct=async cxt=>{
    const {name,_id}=cxt.request.body
    const result = await products.findById({_id})
    const samename=await products.findOne({name})
    if(samename&&""+samename._id!==_id){  //如果找到同名但是_id不同 就提示商品名称重复
        cxt.body = {
            status: 1,
            msg: '商品已存在',
        }
    }else if(result){ 
        await products.updateOne(result, { $set: cxt.request.body })
        cxt.body = {
            status: 0,
            msg: '修改商品成功',
        }
    }
}
exports.removeProduct=async cxt=>{
    const {_id}=cxt.request.body;  
    const result = await products.find({ _id })   
    if (result.length) {   //如果找到了分类,执行删除
        const removeResult=await products.deleteOne({_id})
        if(removeResult){
            cxt.body = {
                status: 0,
                msg: '删除商品成功',
            }
        }else{
            cxt.body = {
                status: 1,
                msg: '删除商品失败',
            }
        }
    }
}
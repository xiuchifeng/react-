const categories=require("../schema/categoryShema")
exports.reqAddCategory=async cxt=>{
    const {categoryName,parentId}=cxt.request.body
    const result=await categories.findOne({name:categoryName})  
    if(result){ //找到就提示重复
        cxt.body ={
            status:1,
            msg:"已存在分类名"
        }
    }else{      //没找到就添加分类
        const category = await categories.create({name:categoryName,parentId})
        cxt.body ={
            status:0,
            data:category,
            msg:"添加分类成功"
        }
    }
}
exports.updateCategory = async cxt => {
    const { categoryName ,_id} = cxt.request.body
    const result =await categories.findOne({_id:_id})  
    console.log(result);
    if(result){
        await categories.updateOne(result,{$set:{name:categoryName}})
        cxt.body={
            status:0,
            msg:"修改成功",
        }       
    }
}

exports.getCategory=async cxt=>{
    const {parentId}=cxt.request.query;
    console.log();
    
    //找到所有的一级分类
    const result = await categories.find({ parentId })
    if (result.length) {   //如果找到了分类集合  那就把集合返回给前台
        cxt.body = {
            status: 0,
            msg: '获取分类成功',
            data: result,
        }
    }else{
        cxt.body = {
            status: 1,
            msg: '获取分类失败',
            data:result
        }
    }
}
exports.removeCategory=async cxt=>{
        const {_id}=cxt.request.body;  
        const result = await categories.find({ _id })   
        if (result.length) {   //如果找到了分类,执行删除
            const removeResult=await categories.remove({_id})
            if(removeResult){
                cxt.body = {
                    status: 0,
                    msg: '删除分类成功',
                }
            }else{
                cxt.body = {
                    status: 1,
                    msg: '删除分类失败',
                }
            }
        }
}
exports.CategoryInfo=async cxt=>{
    const {categoryId}=cxt.request.query;
    console.log("迷惑",cxt.query,cxt.request.query);
    
    console.log(categoryId);
    
    const result = await categories.findById({ _id:categoryId })
    console.log(result);
    
    if (result) {   //如果找到了分类集合  那就把集合返回给前台
        cxt.body = {
            status: 0,
            msg: '查找分类信息成功',
            data: result,
        }
    }else{
        cxt.body = {
            status: 1,
            msg: '查找分类信息失败',
            data:result
        }
    }
}
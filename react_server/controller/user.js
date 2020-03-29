const users = require('../schema/userShema')
exports.addUser = async cxt => {
    const { username } = cxt.request.body

    const result = await users.findOne({ name: username })
    if (result) {   //如果找到了 就提示名称重复
        cxt.body = {
            status: 1,
            msg: '该用户名称重复'
        }
    } else {      //如果没有找到该商品 就添加该商品
        const user = await users.create(cxt.request.body)
        cxt.body = {
            status: 0,
            msg: '创建用户成功',
            data:user
        }
    }
}
exports.getUsers = async cxt => {
    const result = await users.find({username:{$ne:'admin'}});
    if (result.length) {
        cxt.body = {
            status:0,
            data:result,
            msg:"获取用户成功"
        }
    }else{
        cxt.body={
            status:1,
            msg:"获取用户失败"
        }
    }
}
exports.updateUser=async cxt=>{
    const {username,_id}=cxt.request.body
    const result = await users.findById({_id})
    const samename=await users.findOne({username})
    if(samename&&""+samename._id!==_id){  //如果找到同名但是_id不同 就提示名称重复
        cxt.body = {
            status: 1,
            msg: '用户已存在',
        }
    }else if(result){ 
        await users.updateOne(result, { $set: cxt.request.body })
        cxt.body = {
            status: 0,
            msg: '修改用户成功',
            data:await users.findById({_id})
        }
    }
}
exports.removeUser=async cxt=>{
    const {_id}=cxt.request.body;  
    const result = await users.find({ _id })   
    if (result.length) {   //如果找到了分类,执行删除
        const removeResult=await users.deleteOne({_id})
        if(removeResult){
            cxt.body = {
                status: 0,
                msg: '删除用户成功',
            }
        }else{
            cxt.body = {
                status: 1,
                msg: '删除用户失败',
            }
        }
    }
}
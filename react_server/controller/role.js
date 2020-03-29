const roles = require('../schema/roleShema')
exports.addRole = async cxt => {
    const { roleName } = cxt.request.body

    const result = await roles.findOne({ name: roleName })
    if (result) {   //如果找到了 就提示名称重复
        cxt.body = {
            status: 1,
            msg: '该角色名称重复'
        }
    } else {      //如果没有找到该商品 就添加该商品
        const role = await roles.create({ name: roleName })
        cxt.body = {
            status: 0,
            msg: '添加角色成功',
        }
    }
}
exports.getRoles = async cxt => {
    const result = await roles.find();
    if (result.length) {
        cxt.body = {
            status:0,
            data:result,
            msg:"获取角色成功"
        }
    }else{
        cxt.body={
            status:1,
            msg:"获取角色失败"
        }
    }
}
exports.getRole = async cxt => {
    const {roleId}=cxt.query
    const result = await roles.findById({_id:roleId});
    console.log("找到了吗",result);
    console.log("看看",cxt.query);
    if (result) {
        cxt.body={
            status:0,
            msg:"角色查找成功",
            data:result.menus,
        }
    }else{
        cxt.body={
            status:1,
            msg:"角色查找失败"
        }
    }
}
exports.updateRole=async cxt=>{
    const { menus ,_id} = cxt.request.body
    const result = await roles.findById({_id})
    if (result.menus.toString()===menus.toString()) { //如果前端传递的权限信息menus 和查询到的权限信息重复 
        cxt.body = {
            status: 1,
            msg: '权限信息重复，请更改权限',
        }
    } else {      //如果权限没有重复  那就修改该角色信息  $set 只会修改指定的属性
        const role = await roles.updateOne(result,{$set:cxt.request.body})
        cxt.body = {
            status: 0,
            msg: '修改权限成功',
            data:role
        }
    }
    
}
exports.removeRole=async cxt=>{
    const {removerole}=cxt.request.body;  
    const result = await roles.find({ _id:removerole })   
    console.log("结果",result);
    
    if (result.length) {   //如果找到了分类,执行删除
        const removeResult=await roles.deleteOne({_id:removerole})
        if(removeResult){
            cxt.body = {
                status:0,
                msg: '删除角色成功',
            }
        }else{
            cxt.body = {
                status:1,
                msg: '删除角色失败',
            }
        }
    }
}
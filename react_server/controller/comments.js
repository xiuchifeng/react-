const comments = require('../schema/commentShema')
exports.addComment = async cxt => {
    const { username,comment } = cxt.request.body
    if(username){
        const result = await comments.create({username,comment})
        cxt.body = {
            status: 0,
            msg: '评论成功',
            data: result,
        }
    }else{
        cxt.body = {
            status: 1,
            msg: '你谁啊弟弟',
            data:result
        }
    }    
}
exports.getComments=async cxt=>{
    //找到所有的一级分类
    const result = await comments.find()
    if (result.length) {   //如果找到了分类集合  那就把集合返回给前台
        cxt.body = {
            status: 0,
            msg: '获取评论成功',
            data: result,
        }
    }else{
        cxt.body = {
            status: 1,
            msg: '评论为空',
            data:result
        }
    }
}
exports.deleteComment=async cxt=>{
    const {_id}=cxt.request.body;  
    const result = await comments.find({ _id })   
    if (result.length) {   //如果找到了分类,执行删除
        const removeResult=await comments.deleteOne({_id})
        if(removeResult){
            cxt.body = {
                status: 0,
                msg: '删除评论成功',
            }
        }else{
            cxt.body = {
                status: 1,
                msg: '删除评论失败',
            }
        }
    }
}
const mongoose =  require('mongoose')

const commentSchema = new mongoose.Schema({
    username:String, 
    comment:String,//分类名
    create_time:{        //用户创建的初始时间
        type:String,
        default:new Date()
    }
})

//project 数据库下的users  使用userSchema
module.exports = mongoose.model('comments',commentSchema)
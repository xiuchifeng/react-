const mongoose =  require('mongoose')

const categorySchema = new mongoose.Schema({
    name:String,    //分类名
    parentId:{      //分类等级
        type:String,
        default:"0"
    },     //分类值
    create_time:{        //用户创建的初始时间
        type:String,
        default:new Date()
    }
})

//project 数据库下的users  使用userSchema
module.exports = mongoose.model('categories',categorySchema)
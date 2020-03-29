const mongoose =  require('mongoose')

const roleSchema = new mongoose.Schema({
    name:String,
    create_time:{        //角色创建的初始时间
        type:Date,
        default:Date.now
    },
    auth_name: String, // 授权人
    auth_time: String, // 授权时间
    menus:{        //角色的权限
        type:Array,
        default:[]
    },       
})

//project 数据库下的users  使用userSchema
module.exports = mongoose.model('roles',roleSchema)
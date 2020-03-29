const mongoose =  require('mongoose')

const productSchema = new mongoose.Schema({
    name:String,    //商品名
    desc:String,    //商品描述
    price:String,   //商品价格
    pCategoryId:String,  //一级分类ID
    categoryId:String,  //子分类ID
    imgs:Array,
    details:String
})

//project 数据库下的users  使用userSchema
module.exports = mongoose.model('products',productSchema)
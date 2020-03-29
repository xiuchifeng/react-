const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const mongoose =  require('mongoose')
const bodyParser = require('koa-bodyparser');
const multer = require('koa-multer')
const path = require('path')
const fs =require("fs")
const {reqAddCategory,getCategory,updateCategory,removeCategory,CategoryInfo}=require("./controller/category")
const {imgUpload,imgDelete,addProduct,getProducts,searchProducts,updateProduct,removeProduct}=require("./controller/product")
const {addRole,getRoles,updateRole,removeRole,getRole}=require("./controller/role")
const {addUser,getUsers,updateUser,removeUser}=require("./controller/user")
const {addComment,getComments,deleteComment}=require("./controller/comments")
const app = new Koa()
const router = new Router();

//引入用户的模型
const Users = require('./schema/userShema')

app.use(bodyParser());
app.use(static('./public'))
var storage = multer.diskStorage({
    //图片保存在后台的路径
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname) ;//获取图片的后缀名
        cb(null, Date.now() + extname);
    }
})
//加载配置
var upload = multer({ storage: storage });
app.use(router.routes())

router.post('/login',async cxt=>{
    //获取用户的密码和用户名
    //根据用户名和密码查找  如果找到了该用户 则登录成功 
    //否则 用户名或者密码不正确
    console.log("函数运行");
    const {username,password} = cxt.request.body
    const user = await Users.findOne({username,password})
    if(user){   //如果找到了用户
        cxt.body = {    
            status:0,
            data:user,
            msg:'用户登录成功'
        }
    }else{
        cxt.body = {    
            status:1,
            msg:'用户名或者密码不正确'
        }
    }
})
//添加数据
router.post("/category/add",reqAddCategory)
router.post("/product/add",addProduct)
router.post("/role/add",addRole)
router.post("/user/add",addUser)
router.post("/home/comments/add",addComment)
//删除数据
router.post("/category/remove",removeCategory)
router.post("/product/remove",removeProduct)
router.post("/image/delete",imgDelete)
router.post("/role/remove",removeRole)
router.post("/user/remove",removeUser)
router.post("/home/comments/delete",deleteComment)
//获取数据
router.get("/category/info",CategoryInfo)
router.get("/category/list",getCategory)
router.get("/role/list",getRoles)
router.get("/role/info",getRole)
router.get("/product/list",getProducts)
router.get('/product/search', searchProducts)
router.get("/user/list",getUsers)
router.get("/home/comments",getComments)
//更新数据
router.post("/category/update",updateCategory)
router.post("/product/update",updateProduct)
router.post("/role/update",updateRole)
router.post("/user/update",updateUser)
//single是专门接受前台发送的name为"image"的数据
router.post('/image/upload',upload.single('image') ,imgUpload)

//处理前台路由  
app.use(cxt=>{
    console.log('前端路由')
    //设置响应头
    cxt.set('Content-Type', 'textml; charset=UTF-8')
    const data = fs.readFileSync(__dirname+'/public/index.html')
    // console.log(data.toString())
    console.log(data.toString());
    
    cxt.body = data
})
//链接8469下的project数据库
mongoose.connect('mongodb://localhost:27017/project',{
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('27017/project数据库链接成功')  
    app.listen(80,()=>{
        console.log('80')
    })
}).catch(()=>{
    console.log('数据库链接失败')
})
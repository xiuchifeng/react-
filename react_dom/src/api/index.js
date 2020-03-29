import ajax from '../api/ajax'
import jsonp from 'jsonp'
import { message } from 'antd';
//设置axios响应数据的统一格式
//暴露请求登录的接口函数
export const reqLogin = (userInfo)=>ajax('/login',userInfo,"post")

//暴露请求天气信息的接口函数
export const reqWeather=(city)=>{
    const url = "http://wthrcdn.etouch.cn/weather_mini?city="+city
    return new Promise(res=>{
        jsonp(url,{},function(err,data){
            if(data.status===1000){
                let weather = data.data.forecast[0]        
                res(weather)
            }else if(data.status===302){
                message.error("配额超限")
            }
            else{  //如果是非法的城市名 就弹窗提示
                message.error('非法的城市名')
                // res('非法的城市名')
            }
        })
    })
}

//暴露请求添加分类的接口函数
export const reqAddCategory=addcategory=>ajax("/category/add",addcategory,"post")
export const reqAddProduct=productInfo=>ajax("/product/add",productInfo,"post")
export const reqAddrole=addrole=>ajax("/role/add",addrole,"post")
export const reqAdduser=adduser=>ajax("/user/add",adduser,"post")
export const reqAddcomment=(username,comment)=>ajax("/home/comments/add",{username,comment},"post")
//暴露获取的接口函数
export const reqCategory=(parentId)=>ajax("/category/list",{parentId})
export const reqProducts=(page,pagesize)=>ajax("/product/list",{page,pagesize})
export const reqSearchProducts=(page,pagesize,searchtype,keyword)=>ajax("/product/search",{page,pagesize,searchtype,keyword})
export const reqCategoryInfo= (categoryId)=>ajax('/category/info',{categoryId})
export const reqRoles= (role)=>ajax('/role/list',role)
export const reqUsers= (user)=>ajax('/user/list',user)
export const reqRole= (roleId)=>ajax('/role/info',{roleId})
export const reqComments= ()=>ajax('/home/comments')

//暴露请求修改分类的接口函数
export const reqUpdateCategory=(updatecategory)=>ajax("/category/update",updatecategory,"post")
export const reqUpdateProduct=productInfo=>ajax("/product/update",productInfo,"post")
export const reqUpdateRole=roleInfo=>ajax("/role/update",roleInfo,"post")
export const reqUpdateUser=userInfo=>ajax("/user/update",userInfo,"post")


//暴露删除的接口函数
export const reqDeleteImg=name=>ajax("/image/delete",{name},"post")
export const reqRemoveCategory=removecategory=>ajax("/category/remove",removecategory,"post")
export const reqRemoveProduct=removeproduct=>ajax("/product/remove",removeproduct,"post")
export const reqRemoveRole=removerole=>ajax("/role/remove",{removerole},"post")
export const reqRemoveUser=removeuser=>ajax("/user/remove",removeuser,"post")
export const reqDeleteComment=_id=>ajax("/home/comments/delete",{_id},"post")

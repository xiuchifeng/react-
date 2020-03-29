import axios from "axios"
axios.interceptors.response.use(res=>res.data)
export default function Myaxios(url,data={},method="get"){
    return new Promise(resolve=>{
        let p = null
        if (method === 'get') { //如果请求是get方式
            p = axios.get(url, {
                params:data
            })
        } else {
            p = axios.post(url, data)
        }

        p.then(res=>{
            resolve(res)
        })
    })
}
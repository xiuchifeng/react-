import React, { Component } from 'react'
import { Modal } from 'antd';
import { reqWeather } from "../../api"
import { withRouter } from 'react-router-dom'
import "./Header.less"

const storageutils=()=>import("../../utils/storageutils")
const menusConfig=()=>import("../../../src/config/menusConfig")
const MyButton=()=>import("../../commponents/mybutton/MyButton")
const { confirm } = Modal;
export class Header extends Component {
    state = {
        currenTime: new Date().toLocaleString(),
        weatherInfo: {},
        title: "",
        weatherCity: "苏州",
        fengli:""
    }
    UNSAFE_componentWillMount() {
        this.user = storageutils.getUser()
        this.getWeather()
        this.getTitle()
    }

    componentDidMount() {
        this.getCurrent()
    }
    componentWillUnmount (){
        //在Header组件即将卸载时  请求组件内部的定时器
        clearInterval(this.timer)
    }
    getCurrent = () => {
        this.timer = setInterval(() => {
            this.setState({
                currenTime: new Date().toLocaleString()
            })
        }, 1000)
    }
    getWeather = async () => {
        const { weatherCity } = this.state
        const result = await reqWeather(weatherCity)
        let {fengli}=result
        fengli=fengli.substr(10,2)
        
        
        this.setState({
            weatherInfo: result,
            fengli
        })
    }
    getTitle = () => {
        const { pathname } = this.props.location
        let title = ""
        menusConfig.forEach((item) => {
            if (pathname === item.key) title = item.title
            if (item.children) {
                const result = item.children.find(citem => pathname.includes(citem.key) )
                if (result) title = result.title
            }
        }
        )
        return title
    }
    
    loginOut = () => {
        confirm({
            title: "确定退出吗",
            onOk: () => {
                this.props.history.push('/login')
            },
            onCancel() {
                console.log("cancle");
            }
        })
    }
    render() {
        const { currenTime, weatherCity,fengli } = this.state
        const { type, high, low, fengxiang } = this.state.weatherInfo;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{this.user.username}</span>
                    <MyButton onClick={this.loginOut}>退出</MyButton>
                </div>
                <div className="header-bottom">
                    <span className="header-bottom-left">{this.getTitle()}</span>
                    <div className="header-bottom-right">
                        <span>{currenTime}</span>
                        {weatherCity}
                        <span>{type}</span>
                        {fengxiang}
                        <span>{fengli}</span>
                        {high}
                        `{low}
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)

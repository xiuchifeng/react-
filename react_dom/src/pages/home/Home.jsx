import React, { Component } from 'react'
import PubSub from "pubsub-js"
import { Button, message, } from "antd"
import {reqAddcomment,reqComments,} from "../../api/index"
import "./Home.css"

const CommentAdd=()=>import("../../commponents/comment-add")
const CommentList=()=>import("../../commponents/comment-list")
export default class Home extends Component {
    state = {
        comments: [],
    }
    async UNSAFE_componentWillMount(){
        this.initComments()
    }
    componentDidMount() {
        PubSub.subscribe("delete", this.DeleteComment)
        this.style = this.refs.app.style
        this.handleshow()
    }

    //获取评论
    initComments=async ()=>{
        let result=await reqComments();
        const {data}=result;
            if(data===[]){
                this.setState({
                    comments:[]
                })
            }else{
                this.setState({
                    comments:data.reverse()
                })
            } 
    }
    //添加评论
    AddComments = async (username, comment) => {
        let result=await reqAddcomment(username,comment)
        const {msg,status}=result;
        if(status===0){
            this.initComments()
        }else{
            message.error(msg)
        }
    
    }

    showsize = (opacity, width, height, transform) => {
        let style = this.refs.app.style
        style.opacity = opacity;
        style.width = `${width}%`
        style.height = `${height}%`
        style.transform = `rotate(${transform}deg)`;
    }
    handleshow = () => {
        let show =this.state.show===true?false:true
        this.setState({
            show
        })
        let style = this.refs.app.style
        if (style.height === "1%") {
            this.showsize(100, 45, 4, 0)      
        } else {
            this.showsize(0, 1, 1, 710)
        }
    }
  
    render() {
        const { comments } = this.state
        return (
            <div id="home">
                <Button onClick={this.handleshow}>留句话再走?</Button>
                <div className="app" ref="app">
                    <div className="content">
                        <CommentAdd AddComments={this.AddComments} />
                        <CommentList comments={comments} initComments={this.initComments}/>
                        
                    </div>
                </div>
            </div>

        )
    }
}

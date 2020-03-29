import React ,{Component}from 'react';
export default class CommentAdd extends Component{
  constructor(props){
    super()
    this.dom=React.createRef()
  }
    state={
      username:"",//存放用户名
      comment:""  //存放用户评论信息
    }
    UserChange = e=>{
      this.setState({username:e.target.value})
    }
    CommentChange=e=>{
      this.setState({comment:e.target.value})
    }
    AddComment=()=>{
      const {username}=this.state
      let comment=this.dom.current.value;
      this.props.AddComments(username,comment)
      this.dom.current.value=""
      this.setState({
        username:""
      })
    }
    render() {
      const {username}=this.state
      return (
        <div id="left"> 
          <span>你的名字:</span><input type="text" id="commentusername" ref={this.user} value={username} onChange={this.UserChange}/><br/>
          <span>你的评论:</span><textarea rows="4" ref={this.dom} onChange={this.CommentChange}></textarea><br/>
          <button onClick={this.AddComment}>提交评论</button>
        </div>
      )
    };
  };

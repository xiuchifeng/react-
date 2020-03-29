import React ,{Component}from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const CommentItem=()=>import("../comment-item/")
export default class CommentAdd extends Component{


    render() {
      const {comments,initComments}=this.props;
      return (
        <div className="commentslist">
          <Scrollbars>
          <h4 style={{display:comments[0]===undefined?"block":"none"}}>求求你留句话吧</h4>
          <ul>
            {comments.map((item,index)=>{
              return <CommentItem key={index} username={item.username} comment={item.comment} _id={item._id} initComments={initComments}/>
            })
          }
          </ul>
          </Scrollbars>
      
        </div>
      )
    };
  };

import React, { Component } from 'react';
import "./index.css"
import {reqDeleteComment} from "../../api/index"

const Storageutils=()=>import("../../utils/storageutils")
export default class CommentItem extends Component {
    handleDelete =_id => {
       reqDeleteComment(_id)
        this.props.initComments()
    }
    render() {
        let User = Storageutils.getUser();
        let { username, comment, _id ,} = this.props;
        let show = User.username === "admin" ? "block" : "none"
        return (
         
            <li >
                <button className="delete" style={{ display: show }} onClick={() => { this.handleDelete(_id) }}>删除评论</button>
                    <p className="user"><span>{username}</span>:</p>
                    <p className="comments">{comment}</p>
               

            </li>
           
        )
    }
}
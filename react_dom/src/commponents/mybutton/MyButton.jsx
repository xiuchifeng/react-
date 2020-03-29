import React, { Component } from 'react'
import "./MyButton.less"
export default class MyButton extends Component {
    
    render() {
        return (
            <button {...this.props} className="my-button"></button>
        )
    }
}

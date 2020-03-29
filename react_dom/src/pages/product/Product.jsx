import React, { Component } from 'react'
import {Switch,Route} from "react-router-dom"
import AddUpdateProduct from "./AddUpdateProduct"
import HomeProduct from './HomeProduct'
import DetailProduct from './DetailProduct'
export default class Product extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/admin/product/addUpdate" component={AddUpdateProduct}/>
                    <Route path="/admin/product" exact component={HomeProduct}/>
                    <Route path="/admin/product/detail" component={DetailProduct}/>
                </Switch>
            </div>
        )
    }
}

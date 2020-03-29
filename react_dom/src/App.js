import React, { Component} from 'react';
import {Switch,Route,BrowserRouter,Redirect} from "react-router-dom"

// import Login from './pages/login/Login';
// import admin from './pages/admin/admin';
const Login=()=>import("./pages/login/Login")
const Admin=()=>import("./pages/admin/admin")
export default class App extends Component{
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/admin" component={Admin}></Route>
                    <Redirect path to="/login"/>
                </Switch>
            </BrowserRouter>
        )
    }
}
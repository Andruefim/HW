import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { actionLogin, actionRegistration } from "../Actions";
import history from "../history";
import { store } from "../Reducers";
import { Redirect } from "react-router";
import {Link} from 'react-router-dom';

const RegisterForm = ({onLogin = null, isLoggedIn}) =>{
    const [login, setLogin ] = useState('')
    const [password, setPassword ] = useState('')
    const [nick, setNick] = useState("");
    
    if (store.getState().auth && store.getState().auth.login && localStorage.authToken) {
        history.push(`/main`);
    }

    return(
      <div className="d-flex flex-column text-center">
         <input className="shadow-sm form-control mb-2 my-3 bg-light align-self-center" style={{width: 200}} placeholder = 'login' value = {login} onChange = {e=>setLogin(e.target.value)}/>
         <input className="shadow-sm form-control mb-2 my-3 bg-light align-self-center" placeholder = 'password' style={{width: 200}} type = 'password' value = {password} onChange = {e=>setPassword(e.target.value)}/>
         <input
                    className="shadow-sm form-control mb-2 my-3 bg-light align-self-center"
                    style={{width: 200}}
                    value = {nick}
                    readOnly={isLoggedIn}
                    type="tex"
                    placeholder="Nick"
                    onChange={(e) => {
                        setNick(e.target.value);
                    }}
                ></input>
         <button className="shadow-sm btn btn-success my-3 w-50 align-self-center" disabled={!nick || !login || !password} type="submit" onClick = {()=>onLogin(login,password)}>Register</button>
         {<Link className="btn btn-secondary shadow align-self-center mt-3" style={{width:150}} to={`/`}>Login</Link>}
      </div>
    )
  }


const CRegForm = connect((s) => ({ isLoggedIn: s.auth.login, mode: "Registration" }), { onLogin: actionRegistration })(RegisterForm);


export const PageRegistration = () => (
<div style={{height: 600}}>
    <div className="d-flex justify-content-center h-100 w-100" style={{backgroundImage: "url(https://www.tortugacreative.com/wp-content/uploads/social-media-background-dark-2.png)"}}>
        <div className="shadow d-flex flex-column justify-content-center col-12 col-sm-8 col-md-4 col-lg-3 col-xl-3 p-5 h-60 align-self-center"
        style={{backgroundColor: "white"}}>
            <h1 className="align-self-center">Registration</h1>
            <CRegForm />
        </div>
    </div>
</div>
);

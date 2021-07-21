import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { actionLogin, actionRegistration } from "../Actions";
import history from "../history";
import { store } from "../Reducers";
import { Link } from 'react-router-dom';

const LoginForm = ({ onLogin = null, isLoggedIn, mode = "Login" }) => {
    const [login, setLogin] = useState("");
    const [pass, setPass] = useState("");

    if (store.getState().auth && store.getState().auth.login && localStorage.authToken) {
        history.push(`/main`);
    }

    return (
        <div className="d-flex flex-column justify-content-center align-self-center h-100 w-100">
            
                <div className="d-flex flex-column justify-content-center align-self-center">
                   
                        <h2 className="align-self-center">Sign In</h2>
                        <input
                            value={login}
                            type="text"
                            placeholder="Login"
                            className="input shadow-sm form-control mb-2 my-3 bg-light"                       
                            onKeyUp={(e) => {
                                if (e.key === "Enter" && typeof onLogin === "function") onLogin(login, pass);
                            }}
                            onChange={(e) => {
                                setLogin(e.target.value);
                            }}
                        />
                        <input
                            value={pass}
                            type="password"
                            placeholder="Password"
                            className="input shadow-sm form-control mb-2 my-3 bg-light"
                            onKeyUp={(e) => {
                                if (e.key === "Enter" && typeof onLogin === "function") onLogin(login, pass);
                            }}
                            onChange={(e) => {
                                setPass(e.target.value);
                            }}
                        />
                        <br />
                        
                        <button
                            className="btn btn-success align-self-center"
                            style={{width:150}}
                            onClick={() => {
                                if (typeof onLogin === "function") onLogin(login, pass);
                            }}
                            disabled={isLoggedIn || !login || !pass}
                        >
                            Login
                        </button>
                </div>    
                {<Link className="btn btn-secondary shadow align-self-center mt-3" style={{width:150}} to={`/registration`}>Register</Link>}
        </div>
    );
};

const CLoginForm = connect((s) => ({ isLoggedIn: s.auth.login, mode: "Login" }), {
    onLogin: actionLogin,
    onRegistration: actionRegistration,
})(LoginForm);


export const PageLogin = () => (
    <div style={{height: 600}}>
    <div className="d-flex justify-content-center h-100 w-100" style={{backgroundImage: "url(https://www.tortugacreative.com/wp-content/uploads/social-media-background-dark-2.png)"}}>
        <div className="shadow d-flex flex-column justify-content-center col-12 col-sm-8 col-md-4 col-lg-3 col-xl-3 p-5 h-60 align-self-center"
        style={{backgroundColor: "white"}}>
            <CLoginForm />
        </div>
    </div>
</div>
);

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./icons/bootstrap-icons.css";
import "./App.scss";
import {
    Router,
    Route,
    Link,
    Switch,
    NavLink,
    Redirect,
} from "react-router-dom";
import history from "./history";
import { Provider, connect } from "react-redux";
import { Header, Footer } from "./Layout";
import { CPageMain, PageLogin, PageRegistration, CPageNewChat, PageUpload, PageAbout, CPageSearch } from "./Pages";
import { actionFindChatsByUserId } from "./Actions";
import { urlUploadConst } from "./const";
import { store } from "./Reducers";

const PageNotFound = () => {
    setTimeout(() => {
        history.push("/main");
    }, 3000);
    return (
        <div>
            <b>404</b>
        </div>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <Router history={history}>
                <div className="mainWrapper">
                    <Header />

                    <Switch>
                        <Route path="/about" component={PageAbout} exact />
                        <Route path="/newchat" component={CPageNewChat} exact />
                        <Route path="/newchat/:_chatId" component={CPageNewChat} exact />
                        <Route path="/upload" component={PageUpload} exact />
                        <Route path="/" component={PageLogin} exact />
                        <Route path="/registration" component={PageRegistration} exact />
                        <Route path="/main/" component={CPageMain} exact />
                        <Route path="/main/:_chatId" component={CPageMain} exact />
                        {/* <Route path="/search/" component={CPageSearch} exact /> */}

                        <Route component={PageNotFound} exact />
                    </Switch>

                    {/* <Footer /> */}
                </div>
            </Router>
        </Provider>
    );
};

export default App;

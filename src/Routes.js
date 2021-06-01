import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Scanner from "./components/Scanner";
import ResetPassword from "./components/ResetPassword";

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <PrivateRoute exact path="/" component={Scanner}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/forget" component={ResetPassword}/>
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;

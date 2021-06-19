import React from "react";
import {Route, Redirect} from "react-router-dom";
import useAuth from "../context/AuthContextProvider";

const PrivateRoute = ({component: Component, ...rest}) => {
    const {user} = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                return user ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login"/>
                );
            }}
        />
    );
};

export default PrivateRoute;

import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Scanner from './components/Scanner';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/" component={Scanner} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

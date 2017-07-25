import './index.css';
import React from 'react';
import {RegisterForm, LoginForm} from './components/logregform';
import {UsersBox} from './components/users';
import {ExpensesBox} from './components/expenses'
import ReactDOM from 'react-dom';
import {Route} from 'react-router';
import {BrowserRouter, Switch} from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={LoginForm}/>
            <Route exact path='/registration/' component={RegisterForm}/>
            <Route exact path="/expenses/" component={ExpensesBox}/>
            <Route exact path="/user_settings/" component={UsersBox}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('Content')
);

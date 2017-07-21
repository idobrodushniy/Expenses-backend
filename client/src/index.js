import './index.css';
import React from 'react';
import { RegisterForm, LoginForm,
    ExpensesBox } from './App';
import ReactDOM from 'react-dom';
import { Route} from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
    <Switch>
    <Route exact path='/'  component={LoginForm}/>
    <Route exact path='/registration/' component={RegisterForm}/>
    <Route exact path="/expenses/" component={ExpensesBox}/>

    </Switch>
    </BrowserRouter>,
    document.getElementById('Content')
);

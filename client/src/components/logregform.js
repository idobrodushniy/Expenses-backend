import React from 'react';
import readCookie from '../readcookie';
import jQuery from 'jquery';
import {Link} from 'react-router-dom';
import '../App.css'


class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            authorized: false
        }
    }

    validationData = (event) => {
        if (this.state.username.length < 4) {
            return false
        }
        else if (this.state.password.length < 5) {
            return false
        }
        else {
            return true
        }
    }

    alertAboutNotValidData = () => {
        alert('Not valid data!Fill all fields please !')
    }

    handleChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    tologinEvent = (event) => {
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: '/auth/login/',
            type: 'POST',
            data: {'username': this.state.username, 'password': this.state.password},
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                this.setState({username: '', password: '', authorized: true});
                this.props.history.push('/expenses/')
                console.log(data)
            },
            error: (xhr, status, error) => {
                alert(xhr.statusText)
            }
        });
    }

    render() {
        return (
            <div>
                <div className="logForm w3-display-middle">
                    <br/>
                    <input name="username-log" placeholder="Name" className="loginput"
                           onChange={this.handleChangeUsername}/>
                    <br/>
                    <input name="password-log" type="password" placeholder="Password" className="loginput"
                           onChange={this.handleChangePassword}/>
                    {
                        this.validationData() ?
                            <button className="logandregbutton" onClick={this.tologinEvent}>
                                Log in
                            </button> :
                            <button className="logandregbutton" onClick={this.alertAboutNotValidData}>
                                Log in
                            </button>
                    }
                    <Link to="/registration/">
                        <button className="logandregbutton">
                            Registration
                        </button>
                    </Link>
                </div>
            </div>);
    }
}


class RegisterForm extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            email: ''
        }
    }

    validationData = () => {
        if (this.state.username.length < 4) {
            return false
        }
        else if (this.state.password.length < 5) {
            return false
        }
        else if (!this.state.email.match(/.+@.+\..+/i)) {
            return false
        }
        else {
            return true
        }
    }

    alertAboutNotValidData = () => {
        if (this.state.password.length === 0 || this.state.username.length === 0) {
            alert('Fill name and password fields!');
        }
        else if (!this.state.email.match(/.+@.+\..+/i)) {
            alert('Not valid email!')
        }
        else if (this.state.password.length < 6) {
            alert('Password length must be more than 5 characters!')
        }
        else if (this.state.username.length < 4) {
            alert('Username length must be more than 3 characters!')
        }
    }

    handleChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }


    handleChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    toregisterEvent = (event) => {
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: '/users/',
            type: 'POST',
            data: {'username': this.state.username, 'email': this.state.email, 'password': this.state.password},
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                this.setState({username: '', password: '', email: '', registration: false, login: true});
                this.props.history.push('/')
                console.log(data)
            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
    }

    render() {
        return (
            <div>
                <Link to="/">
                    <button className="GlassButton">Back</button>
                </Link>
                <div className="w3-display-middle regForm">
                    <br/>
                    <input name="username-reg" required="required" placeholder="Name" className="reginput"
                           onChange={this.handleChangeUsername}/>
                    <br/>
                    <input name="password-reg" required="required" type="password" placeholder="Password"
                           className="reginput" onChange={this.handleChangePassword}/>
                    <br/>
                    <input name="email-reg" placeholder="Email" className="reginput" onChange={this.handleChangeEmail}/>
                    {
                        this.validationData() ?
                            <button className="logandregbutton" onClick={this.toregisterEvent}>Sign up</button>
                            :
                            <button className="logandregbutton" onClick={this.alertAboutNotValidData}>Sign up</button>
                    }
                </div>
            </div>);
    }
}


export  {
    RegisterForm,
    LoginForm
}

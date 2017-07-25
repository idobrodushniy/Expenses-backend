import React from 'react';
import readCookie from '../readcookie';
import jQuery from 'jquery';
import {Link} from 'react-router-dom';
import createFragment from 'react-addons-create-fragment';
import '../App.css'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

class UniqueUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data[0],
            username: this.props.data[1],
            password1: '',
            password2: '',
            email: this.props.data[3]
        }
    }

    handleClickChangeUserData = () => {
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: `/users/${this.state.id}/`,
            type: 'PATCH',
            data: {'username': this.state.username, 'email': this.state.email},
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                console.log(data)
            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
    }

    handleClickChangePassword = () => {
        if (this.state.password1 !== this.state.password2) {
            alert('Passwords are not same!')
        }
        else if (this.state.password1.length < 5) {
            alert('Password length must be more than 5 characters!')
        }
        else {
            jQuery.ajax({
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
                },
                url: `/users/${this.state.id}/`,
                type: 'PATCH',
                data: {'password': this.state.password1},
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                success: (data) => {
                    console.log(data)
                },
                error: (xhr, status, error) => {
                    console.log(xhr, status, error)
                }
            });
            this.setState({password1: '', password2: ''})
        }
    }

    handleChangePassword1 = (event) => {
        this.setState({password1: event.target.value})
    }

    handleChangePassword2 = (event) => {
        this.setState({password2: event.target.value})
    }

    handleChangeUsername = (event) => {
        this.setState({username: event.target.value})
    }

    handleChangeEmail = (event) => {
        this.setState({email: event.target.value})
    }
    render = () => {
        return (
            <div>
                <hr/>
                <label className="labelInfo">Username: </label>
                <input onChange={this.handleChangeUsername} value={this.state.username} className=" UserFormInput"
                       type="text"/> <br/>
                <label className="labelInfo" style={{paddingRight: 63}}>Email: </label>
                <input onChange={this.handleChangeEmail} value={this.state.email} className=" UserFormInput"
                       type="text"/><br/>
                <button style={{marginLeft: 525, fontSize: 30}} onClick={this.handleClickChangeUserData}
                        className="logandregbutton">Submit
                </button>
                <br/>

                <label style={{paddingRight: 3}} className="labelInfo">Password: </label>
                <input className=" UserFormInput" style={{marginLeft: 5}} onChange={this.handleChangePassword1}
                       placeholder="New Password" type="password" value={this.state.password1}/><br/>
                <input style={{marginLeft: 155}} onChange={this.handleChangePassword2} className=" UserFormInput"
                       type="password" placeholder="Repeat Password" value={this.state.password2}/><br/>
                <button style={{marginLeft: 525, fontSize: 30}} onClick={this.handleClickChangePassword}
                        className="logandregbutton">Change pass
                </button>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        )
    }
}

class UsersBox extends React.Component {

    constructor() {
        super();
        this.state = {
            authorized: true,
            userslist: []
        }
    }

    handleClickLogout = (event) => {
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: '/auth/logout/',
            type: 'POST',
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                console.log(data)
            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
    }

    componentDidMount() {
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: '/users/',
            type: 'GET',
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                var users = data.map((el) => {
                    return createFragment(el)
                });
                this.setState({userslist: users})
                console.log(users)
            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
    }

    render = () => {
        var i = 0;
        return (
            <div>
                <div id="menu">
                    <ul>
                        <li>
                            <Link to="/expenses/">Expenses</Link>
                        </li>
                        <li>
                            <Link to="/user_settings">Users</Link>
                        </li>
                        <li onClick={this.handleClickLogout}>
                            <Link id="LogoutButton" to="/">
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
                <Tabs>
                    <div className="w3-display-topmiddle UsersBox">
                        <div className={this.state.userslist.length === 1 ? "hidden" : ""}>
                            <TabList style={{backgroundColor: "transparent", borderColor: "transparent"}}>
                                {
                                    this.state.userslist.map((el) => {
                                        i++;
                                        return (
                                            <Tab key={i}>
                                                <button className="TabButton">{i}</button>
                                            </Tab>
                                        );
                                    })
                                }
                            </TabList>
                        </div>
                        {
                            this.state.userslist.map((el) => {
                                return (
                                    <TabPanel key={el[0]}>
                                        <UniqueUser data={el} key={el[0]} componentMounting={this.componentDidMount}/>
                                    </TabPanel>
                                )
                            })
                        }
                    </div>
                </Tabs>
            </div>
        )
    }

}

export {
    UsersBox
}
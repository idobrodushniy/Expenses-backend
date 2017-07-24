import React, {PropTypes} from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import ReactSpinner from 'react-spinjs';
import readCookie from './readcookie';
import jQuery from 'jquery';
import { Link } from 'react-router-dom';
import createFragment from 'react-addons-create-fragment';
import './App.css'

class LoginForm extends React.Component{
    constructor(){
        super();
        this.state = {
            username:'',
            password:'',
            authorized:false
        }
    }

    validationData = (event) => {
        if (this.state.username.length < 4){
            return false
        }
        else if(this.state.password.length < 5) {
            return false
        }
        else{
            return true
        }
    }

    alertAboutNotValidData = () =>{
        alert('Not valid data!Fill all fields please !')
    }

    handleChangePassword = (event) => {
        this.setState({
            password:event.target.value
        })
    }

    handleChangeUsername = (event) => {
        this.setState({
            username:event.target.value
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
            url:'/auth/login/',
            type:'POST',
            data:{'username' : this.state.username, 'password' : this.state.password},
            headers: {
                Accept: "application/json; charset=utf-8"
              },
            success: (data) => {
                this.setState({username:'', password:'', authorized:true});
                this.props.history.push('/expenses/')
                console.log(data)
            },
            error: (xhr, status, error) => {
                console.log(xhr)
            }
        });
    }

    render(){
        return (
            <div>
                <div className="logForm w3-display-middle">
                    <br/>
                    <input name="username-log" placeholder="Name" className="loginput" onChange={this.handleChangeUsername}/>
                        <br/>
                    <input name="password-log" type="password" placeholder="Password" className="loginput" onChange={this.handleChangePassword}/>
                    {
                        this.validationData()?
                         <button className="logandregbutton" onClick={this.tologinEvent}>
                            Log in
                        </button>:
                         <button className="logandregbutton"  onClick={this.alertAboutNotValidData}>
                            Log in
                        </button>
                    }
                    <Link  to="/registration/">
                    <button className="logandregbutton">
                        Registration
                    </button>
                    </Link>
                </div>
            </div>);
    }
}


class RegisterForm extends React.Component{
    constructor(){
        super();
        this.state ={
            username:'',
            password:'',
            email:''
        }
    }

    validationData = () => {
        if (this.state.username.length < 4){
            return false
        }
        else if(this.state.password.length < 5) {
            return false
        }
        else if(!this.state.email.match(/.+@.+\..+/i)){
            return false
        }
        else{
            return true
        }
    }

    alertAboutNotValidData = () =>{
        if (this.state.password.length === 0 || this.state.username.length === 0){
            alert('Fill name and password fields!');
        }
        else if (!this.state.email.match(/.+@.+\..+/i)){
            alert('Not valid email!')
        }
        else if (this.state.password.length < 6 ){
            alert('Password length must be more than 5 characters!')
        }
        else if (this.state.username.length < 4){
            alert('Username length must be more than 3 characters!')
        }
    }

    handleChangePassword = (event) => {
        this.setState({
            password:event.target.value
        })
    }

    handleChangeUsername = (event) => {
        this.setState({
            username:event.target.value
        })
    }


    handleChangeEmail = (event) => {
        this.setState({
            email:event.target.value
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

    render(){
        return(
            <div>
            <Link  to="/"><button className="GlassButton">Back</button></Link>
            <div  className="w3-display-middle regForm">
                <br/>
                    <input name="username-reg" required="required" placeholder="Name" className="reginput" onChange={this.handleChangeUsername} />
                        <br/>
                    <input name="password-reg"   required="required" type="password" placeholder="Password" className="reginput" onChange={this.handleChangePassword}/>
                        <br/>
                    <input name="email-reg" placeholder="Email" className="reginput" onChange={this.handleChangeEmail} />
                {
                    this.validationData()?
                            <button className="logandregbutton" onClick={this.toregisterEvent}>Sign up</button>
                         :
                        <button  className="logandregbutton"  onClick={this.alertAboutNotValidData}>Sign up</button>
                }
            </div>
            </div>);
    }
}



class ExpenseComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data[0],
            cost: this.props.data[1],
            text: this.props.data[2],
            date: this.props.data[3],
            time: this.props.data[4],
        }
    }

    handleChangeCost = (event) => {
        this.setState({cost:event.target.value})
    }

    handleChangeText = (event) => {
        this.setState({text:event.target.value})
    }

    handleChangeDate = (event) => {
        this.setState({date:event.target.value})

    }

    handleChangeTime = (event) => {
        this.setState({time:event.target.value})
    }

    handleClickExpenseChange = (event) => {
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: `/expenses/${this.props.data[0]}/`,
            type: 'PUT',
            data: {'cost':this.state.cost, 'text':this.state.text, 'date':this.state.date,
                        'time':this.state.time, 'owner':this.state.owner},
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {

            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
    }

    render(){
        return (
            <div>
                <input onChange={this.handleChangeCost} value={this.state.cost} className="reginput" placeholder="Cost" type="number" /> <br/>
                <input onChange={this.handleChangeText} value={this.state.text} className="reginput" placeholder="Comment" type="text" /> <br/>
                <input onChange={this.handleChangeDate} value={this.state.date}  className="reginput"  type="date" style={{width : 355 }}/> <br/>
                <input onChange={this.handleChangeTime} value={this.state.time} className="reginput" placeholder="Time" type="time" style={{width : 355 }} /> <br/>
                <button onClick={this.handleClickExpenseChange} className="logandregbutton">Ok</button>
            </div>
        );
    }

}



class UniqueExpense extends React.Component{
    static propTypes = {
        isLoading: PropTypes.bool,
    }

    constructor(props){
        super(props);
        this.state = {
            isShowingModal: false,
            id:this.props.data[0],
            cost: this.props.data[1],
            text: this.props.data[2],
            date: this.props.data[3],
            time: this.props.data[4],
        }
    }


    handleClose = () => {
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: `/expenses/${this.props.data[0]}/`,
            type: 'GET',
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                this.setState({cost: data.cost,
                    text: data.text,
                    date: data.date,
                    time: data.time,
                    isShowingModal: false})
            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
    }

    handleDeleteButton = (event) =>{
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: `/expenses/${this.props.data[0]}/`,
            type: 'DELETE',
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                this.setState({
                    cost: null,
                    text: null,
                    date: null,
                    time: null,
                    isShowingModal: false})
                console.log(data)
                this.props.updating();

            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
    }

    handleClickChangeButton = (event) => {
        this.setState({isShowingModal: true})
    }


    render(){
        const {
            props: {
                isLoading,
            },
        } = this;
        return(
            <tr>
                <td hidden> {this.props.data[0]}</td>
                <td>{this.state.cost}</td>
                <td> {this.state.text}</td>
                <td> {this.state.date}</td>
                <td> {this.state.time}</td>
                <td style={{width:50}}  ><button className="ChangeExpenseButton" onClick={this.handleClickChangeButton}>Change</button></td>
                <td style={{width:50}}  ><button className="ChangeExpenseButton" onClick={this.handleDeleteButton}>Delete</button></td>
            <span>
                {
                    this.state.isShowingModal &&
                    <ModalContainer onClose={this.handleClose}>
                        {
                            isLoading ? <ReactSpinner/> :
                                <ModalDialog style={{backgroundColor: '#7d8aa0'}} onClose={this.handleClose}>
                                    <ExpenseComponent data={this.props.data} history={this.props.history} />
                                </ModalDialog>
                        }
                    </ModalContainer>
                }
            </span>
            </tr>

        )
    }
}




class ExpensesBox extends React.Component{
    static propTypes = {
        isLoading: PropTypes.bool,
    }

    constructor(){
        super();
        this.state = {authorized:true,
            isShowingModal:false,
            expenseslist:[],
            cost:null,
            text:'',
            date:null,
            time:null,
            owner:null
        }
    }

    handleChangeCost = (event) => {
        this.setState({cost:event.target.value})
    }

    handleChangeText = (event) => {
        this.setState({text:event.target.value})
    }

    handleChangeDate = (event) => {
        this.setState({date:event.target.value})
    }

    handleChangeTime = (event) => {
        this.setState({time:event.target.value})
    }

    componentDidMount = () =>{
        jQuery.ajax({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            },
            url: '/expenses/',
            type: 'GET',
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: (data) => {
                var expenses = data.map((el) => {
                    return createFragment(el)
                });
                this.setState({expenseslist:expenses})
            },
            error: (xhr, status, error) => {
                console.log(xhr, status, error)
            }
        });
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

    handleClickCreate = (event) => {
        this.setState({isShowingModal: true})
    }

    handleClose = (event) => {
        this.setState({isShowingModal: false})
    }

    handleClickExpenseCreate = (event) => {
                jQuery.ajax({
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    beforeSend: (xhr) => {
                        xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
                    },
                    url: '/expenses/',
                    type: 'POST',
                    data: {'cost':this.state.cost, 'text':this.state.text, 'date':this.state.date,
                        'time':this.state.time, 'owner':this.state.owner},
                    headers: {
                        Accept: "application/json; charset=utf-8"
                    },
                    success: (data) => {
                        jQuery.ajax({
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true
                                },
                                beforeSend: (xhr) => {
                                    xhr.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
                                },
                                url: '/expenses/',
                                type: 'GET',
                                headers: {
                                    Accept: "application/json; charset=utf-8"
                                },
                                success: (data) => {
                                    var expenses = data.map((el) => {
                                        return createFragment(el)
                                    });
                                    console.log(expenses)
                                    this.setState({authorized:true,
                                        expenseslist:expenses,
                                        cost:null,
                                        text:'',
                                        date:null,
                                        time:null,
                                        owner:null,
                                        isShowingModal:false,
                                    })
                                },
                                error: (xhr, status, error) => {
                                    console.log(xhr, status, error)
                                }
                            });

                    },
                    error: (xhr, status, error) => {
                        console.log(xhr, status, error)
                    }
                });
    }

    render(){
        const {
            props: {
                isLoading,
            },
        } = this;

        return(
            <div>
                <div id="menu">
                    <ul>
                        <li>
                            <Link to="/expenses/" >Expenses</Link>
                        </li>
                        <li>
                            <Link to="/user_settings" >Users</Link>
                        </li>
                        <li onClick={this.handleClickLogout}>
                            <Link id="LogoutButton" to="/" >
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="w3-display-topmiddle ExpensesBox ">
                    <table><tbody>
                    <tr>
                        <th hidden>id</th>
                        <th>Cost</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th></th>
                        <th></th>
                    </tr>
                    {
                        this.state.expenseslist.map( (el) => {
                            return (
                                <UniqueExpense onChange={this.componentDidMount} data={el} key={el[0]} updating={this.componentDidMount} history={this.props.history} />
                            );
                        })
                    }
                    </tbody>
                    </table>
                    <button className="GlassButton " id="CreateButton" onClick={this.handleClickCreate}>
                        Create
                    </button>
                </div>
                    {
                        this.state.isShowingModal &&
                        <ModalContainer onClose={this.handleClose}>
                            {
                                isLoading ?
                                <ReactSpinner/> :
                                    <ModalDialog style={{backgroundColor: '#7d8aa0'}} onClose={this.handleClose}>
                                        <input onChange={this.handleChangeCost} className="reginput" placeholder="Cost" type="number" /> <br/>
                                        <input onChange={this.handleChangeText} className="reginput" placeholder="Comment" type="text" /> <br/>
                                        <input onChange={this.handleChangeDate} className="reginput"  type="date" style={{width : 355 }}/> <br/>
                                        <input onChange={this.handleChangeTime} className="reginput" placeholder="Time" type="time" style={{width : 355 }} /> <br/>
                                        <button onClick={this.handleClickExpenseCreate} className="logandregbutton">Create</button>
                                    </ModalDialog>
                            }
                        </ModalContainer>
                    }
            </div>
        );
    }
}


class UniqueUser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            id:this.props.data[0],
            username:this.props.data[1],
            password1:'',
            password2:'',
            email:this.props.data[3]
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
        else if(this.state.password1.length < 5){
            alert('Password length must be more than 5 characters!')
        }
        else{
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
                data: {'password':this.state.password1},
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
            this.setState({password1:'', password2:''})
        }
    }

    handleChangePassword1 = (event) => {
        this.setState({password1:event.target.value})
    }

    handleChangePassword2 = (event) => {
        this.setState({password2:event.target.value})
    }

    handleChangeUsername = (event) => {
        this.setState({username:event.target.value})
    }

    handleChangeEmail = (event) => {
        this.setState({email:event.target.value})
    }
    render = () => {
        return (
            <div>
                <hr/>
                <label className="labelInfo">Username: </label>
                     <input onChange={this.handleChangeUsername} value={this.state.username} className=" UserFormInput" type ="text" /> <br/>
                <label className="labelInfo" style={{ paddingRight:63}} >Email: </label>
                     <input onChange={this.handleChangeEmail} value={this.state.email} className=" UserFormInput" type ="text" /><br/>
                <button style={{marginLeft: 525, fontSize:30 }} onClick={this.handleClickChangeUserData} className="logandregbutton">Submit</button><br/>

                <label style={{ paddingRight:3}}  className="labelInfo" >Password: </label>
                    <input className=" UserFormInput" onChange={this.handleChangePassword1} placeholder="New Password" type ="password" value={this.state.password1} /><br/>
                    <input style={{ marginLeft:150}}  onChange={this.handleChangePassword2} className=" UserFormInput" type ="password" placeholder="Repeat Password" value={this.state.password2} /><br/>
                <button style={{marginLeft:525, fontSize:30}} onClick={this.handleClickChangePassword} className="logandregbutton">Change pass</button><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        )
    }
}

class UsersBox extends React.Component{
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

    componentDidMount(){
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
                    this.setState({userslist:users})
                    console.log(users)
                },
                error: (xhr, status, error) => {
                    console.log(xhr, status, error)
                }
            });
    }

    constructor(){
        super();
        this.state = {
            authorized:true,
            userslist:[]
        }
    }

    render = () => {
        return (
        <div>
            <div id="menu">
                <ul>
                    <li>
                        <Link to="/expenses/" >Expenses</Link>
                    </li>
                    <li>
                        <Link to="/user_settings" >Users</Link>
                    </li>
                    <li onClick={this.handleClickLogout}>
                        <Link id="LogoutButton" to="/" >
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="w3-display-topmiddle UsersBox">
                {
                    this.state.userslist.map((el) => {
                        return (
                            <UniqueUser data={el} key={el[0]} componentMounting={this.componentDidMount}/>
                        )
                    })

                }
            </div>
        </div>


    )}

}

export  {
    RegisterForm,
    LoginForm,
    ExpensesBox,
    ExpenseComponent,
    UsersBox
}


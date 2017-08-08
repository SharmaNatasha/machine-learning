/**
 * register.jsx: registration form.
 *
 * @RegisterForm, must be capitalized in order for reactjs to render it as a
 *     component. Otherwise, the variable is rendered as a dom node.
 *
 * Note: this script implements jsx (reactjs) syntax.
 */

import React from 'react';
import Spinner from '../general/spinner.jsx';
import { browserHistory } from 'react-router';
import setLoginState from '../redux/action/login.jsx';
import ajaxCaller from '../general/ajax-caller.js';
import checkValidString from '../validator/valid-string.js';
import checkValidEmail from '../validator/valid-email.js';
import checkValidPassword from '../validator/valid-password.js';

var RegisterForm = React.createClass({
  // initial 'state properties'
    getInitialState: function() {
        return {
            ajax_done_result: null,
            validated_status: null,
            display_spinner: false,
            submit_registration: false,
            validated_username: true,
            validated_email: true,
            validated_password: true,
            validated_username_server: true,
            validated_email_server: true,
            validated_password_server: true,
            value_username: '',
            value_email: '',
            value_password: '',
        };
    },
  // callback: used to return spinner
    getSpinner: function() {
        if (this.state.display_spinner) {
            return Spinner;
        }
        else {
            return 'span';
        }
    },
  // callback: update state signifying submitted registration
    submit_registration: function(event) {
        this.setState({submitted_registration: true});
    },
  // send form data to serverside on form submission
    handleSubmit: function(event) {
      // prevent page reload
        event.preventDefault();

      // local variables
        if (this.submit_registration) {
            var ajaxEndpoint = '/register';
            var ajaxArguments = {
                'endpoint': ajaxEndpoint,
                'data': new FormData(this.refs.registerForm)
            };

          // boolean to show ajax spinner
            this.setState({display_spinner: true});

          // asynchronous callback: ajax 'done' promise
           ajaxCaller(function (asynchObject) {
            // Append to DOM
                if (asynchObject && asynchObject.error) {
                    this.setState({ajax_done_error: asynchObject.error});
                } else if (asynchObject) {
                    console.log('status: ' + asynchObject.status);
                    console.log('status type: ' + typeof(asynchObject.status));
                    console.log('username: ' + asynchObject.username);
                    console.log('email: ' + asynchObject.email);
                    this.setState({ajax_done_result: asynchObject});
                }
                else {
                    this.setState({ajax_done_result: null});
                }
            // boolean to hide ajax spinner
                this.setState({display_spinner: false});
            }.bind(this),
          // asynchronous callback: ajax 'fail' promise
            function (asynchStatus, asynchError) {
                if (asynchStatus) {
                    this.setState({ajax_fail_status: asynchStatus});
                    console.log('Error Status: ' + asynchStatus);
                }
                if (asynchError) {
                    this.setState({ajax_fail_error: asynchError});
                    console.log('Error Thrown: ' + asynchError);
                }
            // boolean to hide ajax spinner
                this.setState({display_spinner: false});
            }.bind(this),
          // pass ajax arguments
            ajaxArguments);
        }
    },
    componentWillMount: function() {
      // redirect to homepage if logged-in
        if (
            this.props &&
            this.props.user &&
            !!this.props.user.name &&
            this.props.user.name != 'anonymous'
        ) {
            browserHistory.push('/');
        }
    },
    validateUsername: function(event) {
        const username = event.target.value;
        const check = checkValidString(username) ? true : false;

        this.setState({'validated_username': check});
        this.setState({value_username: username});
    },
    validateEmail: function(event) {
        const email = event.target.value;
        const check = checkValidEmail(email) ? true : false;

        this.setState({'validated_email': check});
        this.setState({value_email: email});
    },
    validatePassword: function(event) {
        const password = event.target.value;
        const check = checkValidPassword(password) ? true : false;

        this.setState({'validated_password': check});
        this.setState({value_password: password});
    },
  // define properties after update
    componentDidUpdate: function() {
        if (
            !!this.state.ajax_done_result &&
            this.state.ajax_done_result.status
        ) {
            var status = this.state.ajax_done_result.status;
            console.log('status: ' + status);
            console.log('validated_status: ' + status);

          // server handles one error at a time
            if (this.state.validated_status != status) {
                switch(status) {
                    case status == 1:
                        this.setState({'validated_password_server': false});
                    case status == 2:
                        this.setState({'validated_username_server': false});
                    case status == 3:
                        this.setState({'validated_email_server': false});
                    default:
                        this.setState({'validated_password_server': true});
                        this.setState({'validated_username_server': true});
                        this.setState({'validated_email_server': true});
                }

              // reset to prevent infinite recursion
                this.setState({'validated_status': status});
                console.log('validated_status: ' + status);
            }
        }
    },
  // triggered when 'state properties' change
    render: function() {
      // local variables
        var AjaxSpinner = this.getSpinner();
        var usernameClass = this.state.validated_username ?  '' : 'invalid';
        var passwordClass = this.state.validated_password ? '' : 'invalid';

        console.log('validated_password_server: ' + this.state.validated_password_server);
        console.log('validated_username_server: ' + this.state.validated_username_server);
        console.log('validated_email_server: ' + this.state.validated_email_server);

      // frontend validation
        if (this.state.validated_email) {
            var emailClass = '';
            var emailNote = '';
        }
        else {
            var emailClass = 'invalid';
            var emailNote = <span className={emailClass}>
                Please provide a valid email.
            </span>;
        }

      // backend validation
        if (!this.state.validated_password_server) {
            var passwordNote = <span className='server-response invalid'>
                (Password requirement not met)
            </span>;
        }

        if (!this.state.validated_username_server) {
            var usernameNote = <span className='server-response invalid'>
                (Username is taken)
            </span>;
        }

        if (!this.state.validated_email_server) {
            var emailNote = <span className='server-response invalid'>
                (Email has already registered)
            </span>;
        }

        return(
            <form onSubmit={this.handleSubmit} ref='registerForm'>
                <div className='form-group'>
                    <label className={'form-label ' + usernameClass}>Username</label>
                    <input
                        type='text'
                        name='user[login]'
                        className='input-block'
                        placeholder='Pick a username'
                        onInput={this.validateUsername}
                        value={this.state.value_username}
                    />
                    <p className={'note ' + usernameClass}>
                        This will be your username. {usernameNote}
                    </p>
                </div>

                <div className='form-group'>
                    <label className={'form-label ' + emailClass}>Email Address</label>
                    <input
                        type='text'
                        name='user[email]'
                        className='input-block'
                        placeholder='Your email address'
                        onInput={this.validateEmail}
                        value={this.state.value_email}
                    />
                    <p className='note'>
                        You will get updates regarding account changes,
                        or activitites. This email address will not be
                        shared with anyone. {emailNote}
                    </p>
                </div>
 
                <div className='form-group'>
                    <label className={'form-label ' + passwordClass}>Password</label>
                    <input
                        type='password'
                        name='user[password]'
                        className='input-block'
                        placeholder='Create a password'
                        onInput={this.validatePassword}
                        value={this.state.value_password}
                    />
                    <p className={'note ' + passwordClass}>
                        Use at least one letter, one numeral,
                        and ten characters. {passwordNote}
                    </p>
                </div>

                <input
                    type='submit'
                    className='btn btn-primary'
                    value='Create an account'
                    onClick={this.submit_registration}
                />
                <AjaxSpinner />
            </form>
        );
    }
});

// indicate which class can be exported, and instantiated via 'require'
export default RegisterForm

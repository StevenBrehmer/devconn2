import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';



const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''

    });
    const {email, password} = formData;

    // need to make a copy of data so use spread operator ...
    const onChange =  e => setFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        login(email,password);
    }
    // Redirect if logged in
    if(isAuthenticated){
      return <Redirect to='/dashboard' />
    };

    return (
    <Fragment> 
    <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e=> onChange(e) } />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} onChange={e=> onChange(e) }
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Sign In" />
      </form>
      <p className="my-1">
        New User?<Link to="/register"> Register</Link>
      </p>
    </Fragment>
    )
}

Login.propTypes = {
  login: PropTypes.func.isRequired, //ptfr,
  isAuthenticated: PropTypes.bool,  // ptb
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps,{login})(Login)

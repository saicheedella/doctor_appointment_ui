import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import TitleComponent from './title';
import { setItemHelper } from '../utils';
import { login } from '../apis';
import { addUser } from '../redux/actions/user';
import { useDispatch } from 'react-redux';
import LoadingIndicator from '../components/LoadingIndicator';

const Login = () => {
  const dispatch = useDispatch();
  const [state, setstate] = useState({
    email: '',
    password: '',
    redirect: false,
    authError: false,
    isLoading: false,
    location: {},
  });

  const setState = setItemHelper(state, setstate);

  const handleSubmit = (event) => {
    event.preventDefault();
    setState('authError')('');
    login(state).then((res) => {
      if (res.success) {
        dispatch(addUser(res));
      } else {
        setState('authError')(res.message);
      }
    });
  };

  const renderRedirect = () => {
    if (state.redirect) {
      return <Redirect to='/dashboard' />;
    }
  };

  const isLoading = state.isLoading;
  return (
    <div className='container'>
      <TitleComponent title='Doctor Appointment App '></TitleComponent>
      <div className='card card-login mx-auto mt-5'>
        <div className='card-header'>Login</div>
        <div className='card-body'>
          {state.authError && <div className={'alert alert-danger'}>{state.authError}</div>}
          {/* <div className={'alert ' + (state.authError ? 'alert-danger' : 'alert-success')}>
            {state.authError || state.success}
          </div> */}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <div className='form-label-group'>
                <input
                  className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                  id='inputEmail'
                  placeholder='Email address'
                  type='text'
                  name='email'
                  onChange={(e) => setState('email')(e.target.value)}
                  autoFocus
                  required
                />
                <label htmlFor='inputEmail'>Email address</label>
                <div className='invalid-feedback'>Please provide a valid Email.</div>
              </div>
            </div>
            <div className='form-group'>
              <div className='form-label-group'>
                <input
                  type='password'
                  className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                  id='inputPassword'
                  placeholder='******'
                  name='password'
                  onChange={(e) => setState('password')(e.target.value)}
                  required
                />
                <label htmlFor='inputPassword'>Password</label>
                <div className='invalid-feedback'>Please provide a valid Password.</div>
              </div>
            </div>
            <div className='form-group'>
              <button className='btn btn-primary btn-block' type='submit' disabled={state.isLoading ? true : false}>
                Login &nbsp;&nbsp;&nbsp;
                <LoadingIndicator isLoading={isLoading} />
              </button>
            </div>
          </form>
          <div className='text-center'>
            <Link className='d-block small mt-3' to={'register'}>
              Register an Account
            </Link>
          </div>
        </div>
      </div>
      {renderRedirect()}
    </div>
  );
};

export default Login;

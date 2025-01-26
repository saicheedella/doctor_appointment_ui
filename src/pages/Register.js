import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TitleComponent from './title';
import { setItemHelper } from '../utils';
import { getDepartments, getUserTypes, register } from '../apis';
import { addUser } from '../redux/actions/user';
import { useDispatch } from 'react-redux';
import LoadingIndicator from '../components/LoadingIndicator';

const Register = () => {
  const dispatch = useDispatch();
  const [state, setstate] = useState({
    email: '',
    password: '',
    redirect: false,
    authError: false,
    location: {},
  });

  const [userTypes, setuserTypes] = useState([]);
  const [departments, setdepartments] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const setState = setItemHelper(state, setstate);

  //   const setField = setItemHelper(fields, setfields);

  useEffect(() => {
    fetchUserTypes();
    fetchDepartments();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setState('authError')('');
    register(state).then((res) => {
      if (res.success) {
        dispatch(addUser(res));
      } else {
        setState('authError')(res.message);
      }
    });
  };

  const fetchUserTypes = () => {
    setisLoading(true);
    getUserTypes().then((res) => {
      if (res.success) {
        setisLoading(false);
        setuserTypes(res.userTypes);
      }
    });
  };

  const fetchDepartments = () => {
    setisLoading(true);
    getDepartments().then((res) => {
      if (res.success) {
        setisLoading(false);
        setdepartments(res.departments);
      }
    });
  };


  return (
    <LoadingIndicator isLoading={isLoading}>
      <div className='container'>
        <TitleComponent title='Register'></TitleComponent>
        <div className='card card-login mx-auto mt-5'>
          <div className='card-header'>Register</div>
          <div className='card-body'>
            {(state.authError || state.success) && (
              <div className={'alert ' + (state.authError ? 'alert-danger' : 'alert-success')}>
                {state.authError || state.success}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <div className='form-label-group'>
                  <input
                    className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                    id='inputName'
                    placeholder='Name'
                    type='text'
                    name='name'
                    onChange={(e) => setState('name')(e.target.value)}
                    autoFocus
                    required
                  />
                  <label htmlFor='inputName'>Name</label>
                </div>
              </div>
              <div className='form-group'>
                <div className='form-label-group'>
                  <input
                    className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                    id='inputDOB'
                    placeholder='DOB'
                    type='date'
                    name='DOB'
                    onChange={(e) => setState('dob')(e.target.value)}
                    required
                  />
                  <label htmlFor='inputDOB'>DOB</label>
                </div>
              </div>

              <div className='form-group'>
                <div className='form-label-group'>
                  <select
                    className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                    id='inputGender'
                    name='gender'
                    onChange={(e) => setState('gender')(e.target.value)}
                    required
                  >
                    <option selected disabled>
                      ---select gender---
                    </option>
                    <option value={'male'}>Male</option>
                    <option value={'female'}>Female</option>
                    <option value={'others'}>Others</option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <div className='form-label-group'>
                  <select
                    className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                    id='inpuusertype'
                    name='inpuusertype'
                    onChange={(e) => setState('userTypeId')(+e.target.value)}
                    required
                  >
                    <option selected disabled>
                      ---select usertype---
                    </option>
                    {userTypes.map((u) => (
                      <option key={u.name} value={u.id}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {state && state.userTypeId === 2 && (
                <div className='form-group'>
                  <div className='form-label-group'>
                    <select
                      className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                      id='inputDetartment'
                      name='inputDetartment'
                      onChange={(e) => setState('departmentId')(e.target.value)}
                      required
                    >
                      <option selected disabled>
                        ---Select Department---
                      </option>
                      {departments.map((u) => (
                        <option key={u.name} value={u.id}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className='form-group'>
                <div className='form-label-group'>
                  <input
                    className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                    id='inputMobile'
                    placeholder='Mobile'
                    type='text'
                    name='Mobile'
                    onChange={(e) => setState('phone')(e.target.value)}
                    required
                  />
                  <label htmlFor='inputMobile'>Mobile</label>
                </div>
              </div>
              <div className='form-group'>
                <div className='form-label-group'>
                  <input
                    className={'form-control ' + (state.authError ? 'is-invalid' : '')}
                    id='inputEmail'
                    placeholder='Email address'
                    type='text'
                    name='email'
                    onChange={(e) => setState('email')(e.target.value)}
                    required
                  />
                  <label htmlFor='inputEmail'>Email address</label>
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
                </div>
              </div>
              <div className='form-group'>
                <button className='btn btn-primary btn-block' type='submit' disabled={state.isLoading ? true : false}>
                  Register &nbsp;&nbsp;&nbsp;
                  {isLoading ? (
                    <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                  ) : (
                    <span></span>
                  )}
                </button>
              </div>
            </form>
            <div className='text-center'>
              <Link className='d-block small mt-3' to={'/'}>
                Login To Your Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LoadingIndicator>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import Header from '../elements/header';
import Sidebar from '../elements/DoctorSideBar';
import PatientSidebar from '../elements/PatientSidebar';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setItemHelper } from '../utils';
import { getDepartments, editUser, uploadUserPic } from '../apis';
import Avatar from 'react-avatar';
import Switch from 'react-switch';
import { checkedIcon, uncheckedIcon } from '../utils/icons';
import { updateUser } from '../redux/actions/user';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';

const Profile = () => {
  const { user } = useSelector((s) => s.userDetails);
  const [state, setstate] = useState({ ...user, about: user.about || '' });
  const [departments, setdepartments] = useState([]);
  const fileUploader = React.useRef();

  const dispatch = useDispatch();
  const setState = setItemHelper(state, setstate);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    getDepartments()
      .then((res) => {
        if (res.success && res.departments) {
          setdepartments(res.departments);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateSave = () => {
    editUser(state).then((res) => {
      if (res.success) {
        dispatch(updateUser({ user: res.user }));
        alert('changes Saved successfully!');
      }
    });
  };

  const handleFileUpload = (e) => {
    let data = new FormData();
    data.append('image', e.target.files[0]);

    uploadUserPic(data, user.id)
      .then((response) => {
        if (response.success) {
          dispatch(updateUser({ user: response.user }));
          alert('changes Saved successfully!');
          return;
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Header />
      <div id='wrapper'>
        {user.userTypeId === 2 ? <Sidebar></Sidebar> : <PatientSidebar />}
        <div id='content-wrapper'>
          <div className='container-fluid'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <Link to={'/profile'}>Profile</Link>
              </li>
            </ol>
            <input type={'file'} onChange={(e) => handleFileUpload(e)} className='d-none' ref={fileUploader}></input>
            <div className='container'>
              <Card className='col-6 mx-auto p-0'>
                <Card.Header>
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => fileUploader.current.click()}
                    className='text-center'
                  >
                    {!user.photo ? (
                      <Avatar color='#212529' round name={user.name} size={100} />
                    ) : (
                      <img
                        width='100'
                        height='100'
                        style={{ borderRadius: '50%' }}
                        src={`http://localhost:8000/api/image/${user.photo}`}
                        alt=''
                      />
                    )}
                  </div>
                  <div className='text-center h4'>{user.name}</div>
                  {state.userTypeId === 2 && (
                    <div className='form-group form-switch d-flex justify-content-center align-items-center mb-0'>
                      <label className='pt-1 text-muted'>Open for appointments</label>
                      <Switch
                        height={20}
                        width={40}
                        className={'pl-2'}
                        onColor='#0AB66'
                        checkedIcon={checkedIcon}
                        uncheckedIcon={uncheckedIcon}
                        onChange={(checked) => {
                          setState('openForAppointments')(checked ? 1 : 0);
                        }}
                        checked={state && state.openForAppointments}
                      />
                    </div>
                  )}
                </Card.Header>
                <Card.Body>
                  <div className='form-group'>
                    <div className='form-label-group'>
                      <input
                        className={'form-control '}
                        id='inputName'
                        placeholder='Name'
                        type='text'
                        name='name'
                        value={state.name}
                        onChange={(e) => setState('name')(e.target.value)}
                        autoFocus
                        required
                      />
                      <label htmlFor='inputName'>Name</label>
                    </div>
                  </div>

                  <div className='form-group'>
                    <div className='form-label-group'>
                      <select
                        className={'form-control '}
                        id='inputGender'
                        name='gender'
                        value={state.gender}
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
                  {state && state.userTypeId === 2 && (
                    <div className='form-group'>
                      <div className='form-label-group'>
                        <select
                          className={'form-control '}
                          id='inputDetartment'
                          name='inputDetartment'
                          value={state.departmentId}
                          onChange={(e) => setState('departmentId')(+e.target.value)}
                          required
                        >
                          <option selected disabled>
                            ---Select Department---
                          </option>
                          {departments &&
                            departments.map((u) => (
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
                        value={state.phone}
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
                        value={state.email}
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
                        value={state.password}
                        placeholder='******'
                        name='password'
                        onChange={(e) => setState('password')(e.target.value)}
                        required
                      />
                      <label htmlFor='inputPassword'>Password</label>
                    </div>
                  </div>
                  <div className='form-group'>
                    <div className='form-label-group'>
                      <ReactQuill placeholder='About' value={state.about} onChange={(value) => setState('about')(value)} />
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <div className='text-right'>
                    <Button onClick={handleUpdateSave}>Save</Button>
                  </div>
                </Card.Footer>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

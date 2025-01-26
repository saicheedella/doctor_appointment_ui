import React from 'react';

import Login from './pages/Login';
import Register from './pages/Register';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DoctorSearch from './pages/DoctorSearch';
import Profile from './pages/Profile';
import "react-datepicker/dist/react-datepicker.css";
import Appointments from './pages/Appointments';

export default () => {
  const { token, user } = useSelector((state) => state.userDetails);

  let view;
  
  const unauthenticated = (
    <Switch>
      <Route exact path='/' component={Login} />
      <Route path='/register' component={Register} />
      <Route>
        <Redirect to='/' />
      </Route>
    </Switch>
  );
  const doctor = (
    <Switch>
      <Route path='/profile' component={Profile} />
      <Route path='/appointments' component={Appointments} />
      <Route>
        <Redirect to='/profile' />
      </Route>
    </Switch>
  );

  const patient = (
    <Switch>
      <Route path='/find-doctor' component={DoctorSearch} />
      <Route path='/profile' component={Profile} />
      <Route path='/appointments' component={Appointments} />
      <Route>
        <Redirect to='/find-doctor' />
      </Route>
    </Switch>
  );

  if (token && user.userTypeId === 2) {
    view = doctor;
  } else if (token && user.userTypeId === 1) {
    view = patient;
  } else {
    view = unauthenticated;
  }
  return (
    <div className='App'>
      <Router>{view}</Router>
    </div>
  );
};

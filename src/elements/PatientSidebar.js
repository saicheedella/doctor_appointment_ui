import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default () => {
  const location = useLocation();
  return (
    <div id='wrapper'>
      <ul className='sidebar navbar-nav'>
        <li className={'nav-item ' + (location.pathname === '/find-doctor' ? 'active' : '')}>
          <Link to={'find-doctor'} className='nav-link'>
            <i className='fas fa-fw fa-crosshairs'></i>
            <span>&nbsp;Find A Doctor</span>
          </Link>
        </li>
        <li className={'nav-item ' + (location.pathname === '/profile' ? 'active' : '')}>
          <Link to={'profile'} className='nav-link'>
            <i className='fa fa-user'></i>
            <span>&nbsp;My Profile</span>
          </Link>
        </li>
        <li className={'nav-item ' + (location.pathname === '/appointments' ? 'active' : '')}>
          <Link to={'/appointments'} className='nav-link'>
            <i className='far fa-fw fa-calendar-alt'></i>
            <span>&nbsp;My Appointments</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

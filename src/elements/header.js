import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import TitleComponent from '../pages/title';
import { removeUser } from '../redux/actions/user';

const Header = () => {
  const dispatch = useDispatch();
  const handleClickLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeUser());
  };

  return (
    <nav className='navbar navbar-expand navbar-dark bg-dark static-top'>
      <TitleComponent title='Doctor Appointment App '></TitleComponent>

      <Link to={'/'} className='navbar-brand mr-1'>
        Doctor Appointment App
      </Link>

      <form className='d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0'></form>

      <ul className='navbar-nav ml-auto ml-md-0'>
        <li className='nav-item'>
          <Link
            onClick={handleClickLogout}
            className='btn btn-primary'
          >
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;

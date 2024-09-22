import React, { useState, useEffect, useRef } from 'react';
import { Link ,useLocation ,useNavigate} from 'react-router-dom';
import logo from '../assets/images/HBSLogo.jpeg';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

import { FaUser, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { FiAlignJustify } from "react-icons/fi";


function Manager_NavBar() {
  const [loading, setLoading] = useState(true);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignout =  () => {
    try {
      console.log("trying to logout")
      setLoading(true);
      localStorage.removeItem('token');
      // setIsLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      const pathsToRedirect = ['/manager-dashboard', '/manager-calendar', '/manager-hotel', '/manager-reservations'];
      if (pathsToRedirect.includes(location.pathname)) {
        navigate('/');
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000); 
    }
  }

  return(
    <nav className='fixed z-1000 top-0 left-0 shadow-[rgba(0,0,15,0.5)_2px_2px_2px_0px] w-full bg-white bg-opacity-99'>
        <div className='flex flex-row items-center justify-between'>
          <img src={logo} className='rounded-full px-2 py-2' style={{ height: '75px', width: '75px' }} alt="HBS Logo" />
          <div className='flex items-center justify-between'>
            <Link to="/manager-dashboard" className="btn btn-primary ">Today</Link>
            <Link to="/manager-calendar" className="btn btn-primary ml-4 ">Calendar</Link>
            <Link to="/manager-reservations" className="btn btn-primary ml-4">Reservations</Link>
            <Link to="/manager-hotel" className="btn btn-primary ml-4 ">Hotel</Link>
          </div>
          <div className='mx-4'>
            <Menu>
              <MenuHandler>
                <button className='flex px-4 py-4 items-center'>
                  <FiAlignJustify className='mx-2' /> Menu
                </button>
              </MenuHandler>
              <MenuList className='w-max'>
                <MenuItem >
                <Link to="/profile" className="flex items-center px-4 py-4" >
                  <FaUser className='mr-2' /> Profile
                </Link>
                </MenuItem>
                <MenuItem className='flex px-4 py-4 items-center'>
                   <button className='mr-2 flex px-4 py-4 items-center' onClick={handleSignout} > Sign Out</button>
                </MenuItem>
                <MenuItem className='flex px-4 py-4 items-center '>
                  <FaQuestionCircle className='mr-2' /> Help Center
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </nav>
 
  )
}

export default Manager_NavBar;

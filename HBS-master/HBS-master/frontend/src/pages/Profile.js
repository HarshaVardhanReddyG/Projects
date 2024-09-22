import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import axiosInstance from '../helpers/axios';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [formData, setformData] = useState({
    username: '',
    email: 'example@example.com', // Example email
    password: '',
    phone_number: '',
    country_code: '',
    usertype: 'guest',
  });

  useEffect(() => {
    axiosInstance.get('/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
    
      
      const userData = response.data.user;
      console.log(userData)
      setformData({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone_number: userData.phone_number,
        country_code: userData.country_code,
        usertype: userData.usertype,
      });
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      setLoading(false);
    });
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    axiosInstance.get('/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      const userData = response.data;
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      setLoading(false);
    });
    setformData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(formData);
  };

  return (
    <div className='flex h-screen items-center'>
      <NavBar />
      <div className="mx-auto border top-[78px] justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone_number"
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country_code">
              Country Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="country_code"
              type="text"
              name="country_code"
              placeholder="Country Code"
              value={formData.country_code}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usertype">
              User Type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="usertype"
              name="usertype"
              value={formData.usertype}
              disabled
            >
              <option value="guest">Guest</option>
              <option value="HM">HM</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;

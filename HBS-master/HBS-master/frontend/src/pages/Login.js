import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Loading from '../components/Loading';
import axios from 'axios';

function Login({ loginPopup, setLoginPopup, isLoggedIn, setIsLoggedIn }) {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('guest'); // Default user type is guest
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email !== '' && password !== '') {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email: email,
          password: password,
          usertype: userType
        });

        const token = response.data.token;

        if (token) {
          localStorage.setItem('token', token);

          if (userType === 'guest') {
            await setLoading(true);

            setTimeout(() => {
              setIsLoggedIn(true);
              setLoginPopup(false);
            }, 1000);
          }

          if(userType === 'HM' ){  
            await setLoading(true);

            setTimeout(() => {
              const dashboardRoute = '/manager-dashboard';
              navigate(dashboardRoute);
            }, 1000);
          }
        } else {
          console.error('No token received in response headers');
        }
      } catch (error) {
        window.alert('Incorrect password or email');
        console.error('Error during login:', error);
      }
    } else {
      console.error('Email or password is empty');
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleGoogleLogin = () => {
    // Handle Google Sign-In logic here
  };

  const handleForgotPassword = () => {
    // Navigate to the password reset route
    navigate('/forgot-password');
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                >
                  <option value="guest">Guest</option>
                  <option value="HM">Manager</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between">
              <input
                type="submit"
                className="w-1/2 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSignup}
                className="w-1/2 ml-4 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Login with Google
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot Password?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

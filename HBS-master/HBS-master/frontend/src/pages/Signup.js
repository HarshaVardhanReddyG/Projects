import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import backgroundImage from '../assets/images/signup.jpg'; // Replace with the actual path to your image
import axios from 'axios'
function Signup({signUpPopup, setSignUpPopup}) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [userType, setUserType] = useState('guest');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const handleChange = (phone, country) => {
    setPhone(phone);
    setCountryCode(country.dialCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if phone number is not empty
    if (phone.trim() === '') {
      setError('Phone number cannot be empty');
      return;
    }


    try {

      console.log({
        username: userName,
        email: email,
        password: pass,
        phone_number: phone,
        country_code: countryCode,
        usertype: userType
      })
      const response = await axios.post('http://localhost:5000/signup', {
        username: userName,
        email: email,
        password: pass,
        phone_number: phone,
        country_code: countryCode,
        usertype: userType
      });


      if (response.status === 201) {
        // Prompt the user with a confirmation dialog
        // const confirmed = window.confirm('Registration successful! Proceed to login?');
        // // If user confirms, redirect to login page
        // if (confirmed) {
        //   navigate('/login');
        //   // alert('login to proceed')
        // }
        alert('Registration Succesfull')
        setSignUpPopup(false);
      } 
      
    }


    catch (error) {
      console.error({error: error})
    }


  };

  return (
    <div className="App flex justify-center items-center h-3/5 py-40 from-mycolour to-mycolour2 bg-gradient-115">
      {/* <div className="container"> */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex">
            <div className="w-2/5 bg-register-image" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div className="w-3/5 py-16 px-4"> {/* Adjusted width */}
              <h2 className="text-3xl text-center mb-4">Register</h2>
              <p className="mb-4 text-center">Create your account</p>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={userName}
                  className="border w-full border-gray-400 py-1 px-2 mb-5"
                  placeholder="Username"
                  required
                  onChange={(e) => setUserName(e.target.value)}
                />
                <input
                  type="email"
                  value={email}
                  className="border w-full border-gray-400 py-1 px-2 mb-5"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  value={pass}
                  className="border w-full border-gray-400 py-1 px-2 mb-5"
                  placeholder="Password"
                  required
                  onChange={(e) => setPass(e.target.value)}
                />
                <div className="mb-5"> {/* Added margin-bottom to create space */}
                  <PhoneInput
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: true,
                    }}
                    country={'in'}
                    value={phone}
                    onChange={handleChange}
                    inputClass="border w-full border-gray-400 py-1 px-2"
                  />
                </div>
                <select
                  className="border w-full border-gray-400 py-1 px-2 mb-5"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="guest">Guest</option>
                  <option value="HM">Manager</option>
                </select>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="border w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}

export default Signup;

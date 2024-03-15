import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'
import axios from 'axios'
import Loading from './Loading';
function Registerpage() {

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [dispName, setDispName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [regRes, setRegRes] = useState('0');

  let handleSubmit = async (e) => {
    setRegRes(-2);
    e.preventDefault();

    axios.post('http://localhost:5000/register', {
      userName: userName,
      dispName:dispName,
      password: pass,
      email: email
    }).then((res) => {
      setRegRes(res.data.regRes);
      

    }).catch((err) => {
      console.log(err);
    });

  };

  
useEffect(()=>
{
  if(regRes == 1) 
  { 
    alert("registration succesful")
    setTimeout(()=>
    {
      navigate('/login')
    },1500)
  }
},[regRes]);


  return (
//-2 for processing the request
//-1 for username already taken, display the form again
//0 for initial
//1 for succesful response , navigate to login page, notify for a second that account creation is successful
    <div><Navbar/>
    <div className="App">
      
      {
        regRes == -2 && <Loading/>
      }

   
      
      {
         (regRes ==0 || regRes == -1) &&   <div className="min-h-screen py-40 from-mycolour to-mycolour2 bg-gradient-115">
      
        <div className="container mx-auto">
          <div className="flex w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
            <div className="w-1/2 bg-register-image">
              <h1 className="text-white text-3xl text-center mt-4">Welcome</h1>
             
            </div>
            <div className="w-1/2 py-16 px-12">
              <h2 className='text-3xl text-center mb-4'>Register</h2>
              <p className='mb-4 text-center'>Create your account</p>
              <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          className='border w-full border-gray-400 py-1 px-2 mb-5'
          placeholder="userame"
          required
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          value={dispName}
          className='border w-full border-gray-400 py-1 px-2 mb-5'
          placeholder="display name"
          required
          onChange={(e) => setDispName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          className='border w-full border-gray-400 py-1 px-2 mb-5'
          placeholder="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={pass}
          className='border w-full border-gray-400 py-1 px-2 mb-5'
          placeholder="password"
          required
          onChange={(e) => setPass(e.target.value)}
        />
        {
          regRes==-1 &&
          <p>Username already used</p>
        }

        <button type="submit" className="border w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Register</button>
      </form>
            </div>
          </div>
        </div>
      </div>
}
    </div>
    </div>

  );
}

export default Registerpage;
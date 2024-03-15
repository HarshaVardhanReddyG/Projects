import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Loading from './Loading';
//import { useAuthContext } from '../hooks/useAuthContext';
import { useCookies } from 'react-cookie';


const Login = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
        const navigate = useNavigate();
        const [userName, setUserName] = useState('');
        const [pass, setPass] = useState('');
        const [logRes,setLogRes] = useState(0);
    //    const {dispatch}=useAuthContext()



  let handleSubmit = async (e) => {
    e.preventDefault();
    setLogRes(-3);   
    axios.post('http://localhost:5000/login', {
      userName: userName,
      password: pass,
    }).then((res) => {
      setLogRes(res.data.logRes);
      if (res.data.logRes == 1) {

        setCookie('token', res.data.token, { path: '/' })
        sessionStorage.setItem('token_status',1);

      setTimeout(() => {

        <Loading/>

      }, 2000);

     // dispatch({type: 'LOGIN',payload: {"userName":userName} })
      
    }
      
    }).catch((err) => {
      
      console.log(err);
    })
  }
        
    return (
      <div><Navbar/>
       <div className="App">


      {
        logRes == -3 && <Loading/>
      }


      {/*display for some time that login is succesful and redirecting to home*/ }
      {
          logRes==1 && navigate('/home2')
      }




       {
      (logRes==0 || logRes==-1 || logRes==-2) &&

      <div className="relative flex flex-col justify-center min-h-screen from-red-500 to-blue-500 bg-gradient-115 overflow-hidden">
            <div className="container mx-auto">
          <div className="flex w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
            <div className="w-1/2 bg-register-image">
              <h1 className="text-white text-3xl text-center mt-4">Welcome</h1>
             
            </div>
            <div className="w-1/2 py-16 px-12">
              <h2 className='text-3xl text-center mb-4'>Login</h2>
              <p className='mb-4 text-center'>Enter your credentials</p>
              <form className="mt-6 " onSubmit={handleSubmit}>
                    <div className="mb-2 content-center">
                    <label className="block text-sm font-semibold text-black">
                        Username
                    </label >
                    <input className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-rose-400 focus:ring-rose-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    type="test"
                    onChange = {(e)=>setUserName(e.target.value)}>
                    </input>

                    <label className="block text-sm font-semibold text-black">
                        Password
                    </label>
                    <input className="block w-full px-4 py-2 mt-2 textblack bg-white border rounded-md focus:border-rose-400 focus:ring-rose-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    TYPE="password"
                    onChange = {(e)=>setPass(e.target.value)}>
                    </input>
                    
                    
                    </div>
                    {
                      (logRes==-1 || logRes==-2) && <div>Invalid username or password</div>
                    }
                    <br></br>
                    <button className="bg-slate-200 hover:bg-sky-500 rounded px-4 py-2 w-full">Login</button>
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
 
export default Login;
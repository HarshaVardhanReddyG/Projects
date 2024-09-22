import axios from 'axios'


let headers ={};

if (localStorage.getItem('token')){
    headers.Authorization=`Bearer ${localStorage.getItem('token')}`;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers,

})

export default axiosInstance;
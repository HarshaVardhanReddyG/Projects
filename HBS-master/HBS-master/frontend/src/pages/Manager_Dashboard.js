import {React, useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Manager_NavBar from '../components/Manager_navbar';
import axiosInstance from '../helpers/axios';
import Loading from "../components/Loading";


// const reservations = [
//   {
//     guestName: 'John Doe',
//     checkInDate: '2024-04-01',
//     checkOutDate: '2024-04-26',
//     contactDetails: {
//       email: 'john@example.com',
//       phone: '123-456-7890',
//     },
//   },
//   {
//     guestName: 'Jane Smith',
//     checkInDate: '2024-04-02',
//     checkOutDate: '2024-04-26',
//     contactDetails: {
//       email: 'jane@example.com',
//       phone: '987-654-3210',
//     },
//   },
//   {
//     guestName: 'Alice Johnson',
//     checkInDate: '2024-04-26',
//     checkOutDate: '2024-04-31',
//     contactDetails: {
//       email: 'alice@example.com',
//       phone: '555-555-5555',
//     },
//   },
//   {
//     guestName: 'Bob Williams',
//     checkInDate: '2024-03-04',
//     checkOutDate: '2024-04-31',
//     contactDetails: {
//       email: 'bob@example.com',
//       phone: '666-666-6666',
//     },
//   },
//   {
//     guestName: 'Bob Williams',
//     checkInDate: '2024-03-04',
//     checkOutDate: '2024-04-31',
//     contactDetails: {
//       email: 'bob@example.com',
//       phone: '666-666-6666',
//     },
//   },  

//   {
//     guestName: 'Emma Brown',
//     checkInDate: '2024-04-26',
//     checkOutDate: '2024-05-01',
//     contactDetails: {
//       email: 'emma@example.com',
//       phone: '777-777-7777',
//     },
//   },
//   {
//     guestName: 'Michael Davis',
//     checkInDate: '2024-04-26',
//     checkOutDate: '2024-05-10',
//     contactDetails: {
//       email: 'michael@example.com',
//       phone: '888-888-8888',
//     },
//   },
//   {
//     guestName: 'Olivia Wilson',
//     checkInDate: '2024-04-26',
//     checkOutDate: '2024-04-11',
//     contactDetails: {
//       email: 'olivia@example.com',
//       phone: '999-999-9999',
//     },
//   },
//   {
//     guestName: 'William Martinez',
//     checkInDate: '2024-04-08',
//     checkOutDate: '2024-05-12',
//     contactDetails: {
//       email: 'william@example.com',
//       phone: '111-111-1111',
//     },
//   },
//   {
//     guestName: 'Sophia Taylor',
//     checkInDate: '2024-04-09',
//     checkOutDate: '2024-05-13',
//     contactDetails: {
//       email: 'sophia@example.com',
//       phone: '222-222-2222',
//     },
//   },
//   {
//     guestName: 'James Anderson',
//     checkInDate: '2024-03-10',
//     checkOutDate: '2024-05-14',
//     contactDetails: {
//       email: 'james@example.com',
//       phone: '333-333-3333',
//     },
//   },
// ];

function TodayCard(props){
  return (<div className='white border rounded-lg shadow-lg p-2'>
    <p className='text-pink-500' >{props.status}</p>
    <p>{props.name}</p>
    <p className='border-b'>  {props.checkin} - {props.checkout} </p>
    <p>{props.contact}</p>
  </div>)
}

function Manager_Dashboard() {
    const [todayReservations, setTodayReservations] = useState([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
      setLoading(true); // Set loading to true when the effect starts
  
      axiosInstance.get('today_reservations', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      })
      .then((response) => {
          if (response.data) {
            // console.log("responce date is ",response.data)
            setTodayReservations(response.data.reservations.TodayReservations)
            

          }
      })
      .catch((error) => {
          console.error("Error fetching hotel data:", error);
          // Handle error
      })
      .finally(() => {
          setLoading(false); // Set loading to false when the request is completed (whether success or failure)
      });
  }, []);

    const [activeFilter, setActiveFilter] = useState('Currently hosting');

    const navigate = useNavigate()


    useEffect(()=>{
        axiosInstance.get('hotel', { headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }})
        .then((response)=>{
            console.log(response.data)

            if(response.data){
              if(response.data.HotelDetails.message === "No hotels found for the given manager ID"){
                navigate('/manager-reg-1')
              }
                  
            } 
            else{
                //  navigate('/manager-reg-1')
            }
        })
        // .catch((error) => {
        //   console.error("Error fetching data:", error);
        //   navigate('/manager-reg-1')
        // });
    },[])

    const filterReservations = () => {
      const today = new Date().toISOString().split('T')[0];
      switch (activeFilter) {
        case 'Arriving':
          console.log(todayReservations.start_date );
          return todayReservations.filter(
            (reservation) => reservation.start_date === today
          );
        case 'Checking out':
          return todayReservations.filter(
            (reservation) => reservation.end_date === today
          );
        case 'Currently hosting':
        default:
          return todayReservations.filter(
            (reservation) =>
            reservation.start_date < today &&
            reservation.end_date > today
          );
      }
    };
    console.log("todays object is", todayReservations)
    console.log("filtered reservation are",filterReservations())

    const m_name = "Manager Name";
  
    return (
      <div className='HI'>
        {loading ? (
      <Loading />
    ) : (
      <div>
        <div className='fixed top-0 w-full z-10 mb-20'>
          <Manager_NavBar />
        </div>
        <div className='mt-[100px] ml-[80px]'>
          <h1 className='text-2xl font-bold '> Welcome, {m_name}</h1>
          <p>Your Activities Today </p>
          <div className='flex space-x-4 mt-4'>
            <button
              className={`${
                activeFilter === 'Currently hosting' ? 'border border-black text-black' : 'text-gray'
              } border p-2 rounded-full`}
              onClick={() => setActiveFilter('Currently hosting')}
            >
              Currently hosting
            </button>
            <button
              className={`${
                activeFilter === 'Arriving' ? 'border-b-2 border-black text-black' : 'text-gray'
              } border p-2 rounded-full`}
              onClick={() => setActiveFilter('Arriving')}
            >
              Arriving Soon
            </button>
            <button
              className={`${
                activeFilter === 'Checking out' ? 'border-b-2 border-black text-black' : 'text-gray'
              } border p-2 rounded-full`}
              onClick={() => setActiveFilter('Checking out')}
            >
              Checking Out
            </button>
          </div>

          <div className='grid grid-cols-4 gap-4 mx-2 mt-4' >
            
            {filterReservations().map((todayReservations, index) => (
              <TodayCard
                key={index}
                status={activeFilter}
                name={todayReservations.username}
                checkin={todayReservations.start_date}
                checkout={todayReservations.end_date}
                contact = {todayReservations.phone_number}
              />
            ))}
          </div>
        </div>
        </div>
    )}
      </div>
    );
  }
  
  export default Manager_Dashboard;
  
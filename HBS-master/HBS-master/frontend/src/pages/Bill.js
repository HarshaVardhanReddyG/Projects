import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import hotelsList from '../components/hotels';
import { useParams } from 'react-router-dom';
import axiosInstance from '../helpers/axios';
import Loading from '../components/Loading';


function BillPage() {

  const [reservationList, setReservationList] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const {gid} = useParams()

  useEffect(() => {
    axiosInstance.get(`/bill/${gid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setReservationList(response.data.List);
      } else {
        // Handle other status codes if needed
      }
    })
    .catch((error) => {
      console.error("Error fetching reservation history:", error);
    })
    .finally(() => {
      setLoading(false); // Set loading to false once data is fetched
    });
  }, [gid]);
  

  // Conditional rendering while waiting for reservationList
  if (loading) {
    return <div><Loading /></div>; // You can show a loader or a message
  }

  const reservation = reservationList[0];

  const totalPrice = reservation.reduce(
    (total, room) => total + room.payment,
    0
  );

  const totalRooms = reservation.reduce(
    (total, room) => total + room.No_of_rooms,
    0
  );

  const startDate = new Date(reservation[0].start_date);
  const endDate = new Date(reservation[0].end_date);
  const stayDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  // Once reservationList is populated
  return (
    <div className="HI flex flex-col items-center">
      <div className="fixed top-0 w-full z-10 mb-10 border-b border-gray-300">
        <NavBar />
        {/* <SearchBar /> */}
      </div>
      <div className="m-10"> <p>h</p> </div>
      <div className="bg-white shadow-lg border-t border-gray-100 w-4/5 ">
        <div className="flex border-b border-gray-300  p-6">
          <div>
            <h1 className="text-xl font-bold">Booking Id</h1>

            <p className="text-lg">{reservation[0].gid}</p>
          </div>
          <div className="ml-auto">
            <p>Booked by {reservation[0].username} on {reservation[0].booked_date}</p>
          </div>
        </div>
        <div className="flex border-b border-gray-300  p-4 items-center">
          <div>
            <h1 className="text-xl font-bold">{reservation[0].Hotel_name}</h1>
            <p>{reservation[0].Address}</p>
          </div>
          <div className="ml-auto">
            <img src={`http://localhost:5000/${reservation[0].image}`} className="w-72 h-auto" />
          </div>
        </div>

        <div className="flex justify-between border-b border-gray-300 p-4 items-left">
          <div className="flex-grow flex flex-col items-left">
            <div className='my-2 flex flex-col items-left'>
            <h1 className="text-l font-bold">Primary Guest</h1>
            <p>{reservation[0].username}</p>
            </div>
            <div className='my-2 flex flex-col items-left'>
            <h1 className="text-l font-bold ">Mobile Number</h1>
            <p>{reservation[0].phone_number}</p>
            </div>
            <div className='my-2 flex flex-col items-left'>
            <h1 className="text-l font-bold">Email address</h1>
            <p>{reservation[0].email}</p>
            </div>
            
          </div>
          <div className="flex-grow">
            <h1 className="text-l font-bold">Check in</h1>
            <p>{reservation[0].start_date}</p>
          </div>
          <div className="flex-grow">
            <h1 className="text-l font-bold">Check in Time</h1>
            <p>{reservation[0].check_in}</p>
          </div>
          <div className="flex-grow">
            <h1 className="text-l font-bold">Check Out</h1>
            <p>{reservation[0].end_date}</p>
          </div>
          <div className="flex-grow">
            <h1 className="text-l font-bold">Check Out Time</h1>
            <p>{reservation[0].check_out}</p>
          </div>
          <div className="ml-auto">
            <h1 className="text-3xl font-bold">{stayDays} Night</h1>
            {
            reservation.map(roomType => (
              <div key={roomType.room_type_id} className="flex flex-col items-left">
                <p> {roomType.No_of_rooms}  {roomType.room_type_name} </p>

              </div>
            ))
          }
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-xl font-bold">Payment Details</h1> 
          <div className="flex  border border-gray-300 p-4 m-2">
            <p>Total payable amount</p>
            <h2 className="text-l font-bold ml-auto">{totalPrice}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillPage;

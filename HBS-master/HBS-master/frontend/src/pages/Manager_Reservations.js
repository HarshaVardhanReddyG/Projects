import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Manager_NavBar from '../components/Manager_navbar';
import axiosInstance from "../helpers/axios";
import Loading from "../components/Loading";

function Manager_Reservation() {
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true)
  const [ManagerReservations, setManagerReservations] = useState([])

  useEffect(() => {
    setLoading(true); // Set loading to true when the effect starts

    axiosInstance.get('manager_reservations', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then((response) => {
        if (response.data) {
          console.log(response.data.message.Reservations)
          setManagerReservations(response.data.message.Reservations);
              console.log(ManagerReservations)
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

  const filterReservations = (reservation) => {
    switch (filter) {
      case "Upcoming":
        return (reservation[0].status === "pending" || reservation[0].status === "accepted") &&
                new Date(reservation.checkin) > new Date();
      case "Completed":
        return (reservation[0].status === "accepted") &&  new Date(reservation[0].checkout) < new Date();
      case "Cancelled":
        return (reservation[0].status === "cancelled" || reservation[0].status === "rejected") ;
      default:
        return true;
    }
  };

  const handleConfirm = (gid) => {

     
    const updatedReservations = ManagerReservations.map((reservationSet) => {
      return reservationSet.map((reservation) => {
        if (reservation.gid === gid) {
          return { ...reservation, status: "accepted" };
        } else {
          return reservation;
        }
      });
    });

    setManagerReservations(updatedReservations);
    console.log(gid);
    try {
      const response = axiosInstance.post('confirm_reject',{ gid: gid, status: 'accepted' },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if(response.status === 200)
          alert("Submitted Succesfully")
      console.log(response.data); 
  } catch (error) {
      console.error('Error:', error);
  }
    
  
  };

  const handleReject = (gid) => {
    const updatedReservations = ManagerReservations.map((reservationSet) => {
      return reservationSet.map((reservation) => {
        if (reservation.gid === gid) {
          return { ...reservation, status: "rejected" };
        } else {
          return reservation;
        }
      });
    });
    setManagerReservations(updatedReservations);
    try {
      const response = axiosInstance.post('confirm_reject',{ gid: gid, status: 'rejected' },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if(response.status === 200)
          alert("Submitted Succesfully")
      console.log(response.data); 
  } catch (error) {
      console.error('Error:', error);
  }
    
  };


//   Under upcoming only confirmed or pending upcomimng
// Under completed only confirmed and completed
//  Under cancelled both cancelled and rejected
// All : upcoming pending  > confirmed > completed > cancelled

return (
  <div className="HI">
    {loading ? (
      <Loading />
    ) : (
      <div>
        <div className="fixed top-0 w-full z-10 mb-20">
          <Manager_NavBar />
        </div>
        <div className='mt-[100px] ml-[80px]'>
          <h1 className='text-2xl font-bold'>Reservations</h1>
          <div className="flex justify-center">
            <button
              className={`mx-2 text-gray-600   ${filter === "All" && "underline font-bold "}`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            <button
              className={`mx-2 text-gray-600   ${filter === "Upcoming" && "underline font-bold "}`}
              onClick={() => setFilter("Upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`mx-2 text-gray-600  ${filter === "Completed" && "underline font-bold"}`}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>
            <button
              className={`mx-2 text-gray-600   ${filter === "Cancelled" && "underline font-bold"}`}
              onClick={() => setFilter("Cancelled")}
            >
              Cancelled
            </button>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-7xl">
              <div className="grid gap-4 mb-8">
                <div className="col-span-3 overflow-y-auto rounded-lg shadow-xs">
                  <div className="bg-blue-50 p-5">
                    <div className="grid grid-cols-8 justify-between font-semibold items-center mb-2">
                      <div className="col-span-1 text-center">Id</div>
                      <div className="col-span-1 text-center">Guest Details</div>
                      <div className="col-span-1 text-center">Status</div>
                      <div className="col-span-1 text-center">Rooms</div>
                      <div className="col-span-1 text-center">Checkin</div>
                      <div className="col-span-1 text-center">Checkout</div>
                      <div className="col-span-1 text-center">Total payout</div>
                      <div className="col-span-1 text-center">Actions</div>
                    </div>
                    {ManagerReservations.filter(filterReservations).map((reservation) => (
                      <div key={reservation[0].rid} className="grid grid-cols-8 justify-between items-center mb-2">
                        <div className="col-span-1 text-center">{reservation[0].gid}</div>
                        <div className="col-span-1 text-center">{reservation[0].phone_number}</div>
                        <div className="col-span-1 text-center">{reservation[0].status}</div>
                        <div className="col-span-1 text-center">
                          {reservation.map((roomType, index) => (
                            <div key={index}>{roomType.room_type_name} x {roomType.No_of_rooms}</div>
                          ))}
                        </div>
                        <div className="col-span-1 text-center">{reservation[0].start_date}</div>
                        <div className="col-span-1 text-center">{reservation[0].end_date}</div>
                        <div className="col-span-1 text-center">{reservation.reduce((acc, roomType) => acc + roomType.payment, 0)}</div>
                        <div className="col-span-1 text-center">
                          {reservation[0].status === "pending" && (
                            <>
                              <button onClick = {() => handleConfirm(reservation[0].gid)} className="bg-green-500 text-white px-2 py-1 mr-1 rounded-md text-sm">Confirm</button>
                              <button onClick = {() => handleReject(reservation[0].gid)} className="bg-red-500 text-white px-2 py-1 ml-1 rounded-md text-sm">Reject</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    )}          
  </div>
);
}

export default Manager_Reservation;

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ReservationCard from '../components/Reservation_card';
import axiosInstance from '../helpers/axios';
import { useNavigate } from 'react-router-dom';

function History() {
  const [reservationList, setReservationList] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    axiosInstance.get("/guest_history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        console.log(response.data.message)
        if(response.data.message==='Unauthorized user'){
          navigate("/")
        }
        setReservationList(response.data.List);
      } 
    })
    .catch((error) => {
      console.error("Error fetching reservation history:", error);
    });
  }, []);



  const changeStatus = (id) =>{
    setReservationList(prevList => {
      return prevList.map(group => {
        return group.map(reservation => {
          if (reservation.gid === id) {
            return { ...reservation, status: "cancelled" };
          }
          return reservation;
        });
      });
    });
  }

  const change_review_rating = (id, rat, rev) =>{
    setReservationList(prevList => {
      return prevList.map(group => {
        return group.map(reservation => {
          if (reservation.gid === id) {
            return { ...reservation, rating: rat, review : rev };
          }
          return reservation;
        });
      });
    });
  }

  console.log(reservationList);

  return (
    <div>
      <div className="fixed top-0 w-full z-10 mb-20">
        <NavBar />
      </div>
      <div className="m-10"> <p>h</p></div>
      <div className="mt-10">
        {reservationList.map((reservation, index) => (
          <ReservationCard
            key={index}
            reservation = {reservation}
            changeStatus = {changeStatus}
            change_review_rating = {change_review_rating}

          />
        ))}
      </div>
    </div>
  );
}

export default History;

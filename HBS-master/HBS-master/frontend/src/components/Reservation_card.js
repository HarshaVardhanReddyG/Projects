import React, { useState } from "react";
import axiosInstance from "../helpers/axios";

function ReservationCard(props) {
  const [reviewPopup, setReviewPopup] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [rating, setRating] = useState(props.reservation[0].Rating);
  const [review, setReview] = useState(props.reservation[0].Review);

  const handleCancel = async (gid) => {
    console.log(gid);
    try {
      const response = await axiosInstance.post(
        "/cancel",
        { gid: gid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        // If cancellation is successful, update the reservation list
        // setReservationList(prevList => prevList.filter(reservation => reservation[0].gid !== gid));
        console.log(response);
        if(response.data.message === "Cancellation not possible, check cancellation policy."){
          // console.log("hi");
          alert(response.data.message);
          return;
        }
        props.changeStatus(gid);
      } else {
        // Handle other status codes if needed
        console.error("Cancellation failed. Status:", response.status);
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const handleSubmitReview = async () => {
    try {
      // Send rating and review to the backend
      const response = await axiosInstance.post("/rr", {
        gid: props.reservation[0].gid,
        rating,
        review,
      });
      if (response.status === 200) {
        props.change_review_rating(props.reservation[0].gid, rating, review);
        setReviewPopup(false);
      } else {
        // Handle other status codes if needed
        console.error("Review submission failed. Status:", response.status);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const totalPrice = props.reservation.reduce(
    (total, room) => total + room.payment,
    0
  );

  const totalRooms = props.reservation.reduce(
    (total, room) => total + room.No_of_rooms,
    0
  );

  return (
    <div className="w-3/5 bg-white rounded-lg shadow-lg p-8 mx-auto mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={`http://localhost:5000/${props.reservation[0].image}`}
            alt="Placeholder"
            className="w-32 h-32 object-cover rounded-lg mr-8"
          />
          <div>
            <h1 className="text-l font-bold">{props.reservation[0].Hotel_name}</h1>
            <p className="text-gray-500">
              {props.reservation[0].start_date} -{" "}
              {props.reservation[0].end_date}
            </p>
            <p className="text-gray-500">
              {totalRooms} Rooms{" "}
            </p>
            <p className="text-gray-500">
              {props.reservation[0].Address} Rooms{" "}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{props.reservation[0].gid}</h2>
        </div>
        <div className="flex flex-col items-center">
          {props.reservation[0].status === "pending" ||
          props.reservation[0].status === "accepted" ? (
            <button
              onClick={() => handleCancel(props.reservation[0].gid)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              Cancel Booking
            </button>
          ) : (
            <button
              className="bg-gray-400 text-gray-800 px-4 py-2 rounded mt-4"
              disabled
            >
              Cancel Booking
            </button>
          )}
          <p className="text-black-500">{props.reservation[0].status} </p>
        </div>
        <div className="flex flex-col items-center">
          {props.reservation[0].status === "accepted" ? (
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded mt-4"
              onClick={() => setReviewPopup(true)}
            >
              Give Review
            </button>
          ) : (
            <button
              className="bg-gray-400 text-gray-800 px-4 py-2 rounded mt-4"
              disabled
            >
              Give Review
            </button>
          )}
          <button
            className="text-red-400"
            onClick={() => setDetailsPopup(true)}
          >
            View Details
          </button>
        </div>
      </div>
      {reviewPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center w-2/5">
            <h2 className="text-2xl font-bold mb-4 ">Give Review</h2>
            {/* Rating input */}

            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              className="border rounded-md p-2 mb-4 w-full"
              placeholder="Rating (1-5)"
              onChange={(e) => setRating(e.target.value)}
            />
            <textarea
              value={review}
              className="border rounded-md p-2 mb-4 w-full"
              placeholder="Write your review..."
              onChange={(e) => setReview(e.target.value)}
            ></textarea>

            <div className="flex justify-end">
              <button
                className="bg-blue-400 text-white px-4 py-2 rounded mr-2"
                onClick={handleSubmitReview}
              >
                Submit
              </button>
              <button
                className="bg-red-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setReviewPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {detailsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center w-2/5 h-4/5  overflow-y-auto no-scrollbar">
            <h2 className="text-2xl font-bold mb-4">Reservation Details</h2>
            {props.reservation.map((room) => (
              <div key={room.room_type_id} className="mb-4">
                <h3 className="text-lg font-semibold">{room.room_type_name}</h3>
                <p>Number of Rooms: {room.No_of_rooms}</p>
                <p>Price for  {room.No_of_rooms} {room.room_type_name}: {room.payment}</p>
              </div>
            ))}
            <div className="mt-4">
              <p className="text-lg font-semibold">Total Payable Amount:</p>
              <p>{totalPrice}</p>
            </div>
            <button
              className="bg-red-400 text-white px-4 py-2 rounded mt-4"
              onClick={() => setDetailsPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationCard;

// // import React, {useState, useEffect} from 'react';
// // import { Link } from 'react-router-dom';
// // import NavBar from '../components/NavBar';
// // import SearchBar from '../components/SearchBar';
// // import ReservationCard from '../components/Reservation_card';
// // // import reservationList from '../components/Reservations';

// // // className="fixed top-0 w-full z-10"

// // var initialReservationList = [
//   // [
//   //   {
//   //     "rid": 58,
//   //     "booked_date": "2024-04-23",
//   //     "start_date": "2024-05-09",
//   //     "end_date": "2024-05-12",
//   //     "gid": 29,
//   //     "hotel_id": 1,
//   //     "room_type_id": 3,
//   //     "No_of_rooms": 3,
//   //     "No_of_guests": 3,
//   //     "payment": 6000,
//   //     "status": "pending",
//   //     "createdAt": "2024-04-22T18:43:05.479Z",
//   //     "updatedAt": "2024-04-22T18:43:05.479Z",
//   //     "user_id": 52,
//   //     "Review": null,
//   //     "Rating": null,
//   //     "image_id": 1,
//   //     "image": "hotel2.jpg"
//   //   },
//   //   {
//   //     "rid": 59,
//   //     "booked_date": "2024-04-23",
//   //     "start_date": "2024-05-09",
//   //     "end_date": "2024-05-12",
//   //     "gid": 29,
//   //     "hotel_id": 1,
//   //     "room_type_id": 2,
//   //     "No_of_rooms": 3,
//   //     "No_of_guests": 3,
//   //     "payment": 3000,
//   //     "status": "pending",
//   //     "createdAt": "2024-04-22T18:43:05.479Z",
//   //     "updatedAt": "2024-04-22T18:43:05.479Z",
//   //     "user_id": 52,
//   //     "Review": null,
//   //     "Rating": null,
//   //     "image_id": 1,
//   //     "image": "hotel2.jpg"
//   //   }
//   // ],

// //   [
// //     {
// //       "rid": 59,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 30,
// //       "hotel_id": 1,
// //       "room_type_id": 3,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 6000,
// //       "status": "confirmed",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     },
// //     {
// //       "rid": 60,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 30,
// //       "hotel_id": 1,
// //       "room_type_id": 2,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 3000,
// //       "status": "confirmed",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     }
// //   ],
// //   [
// //     {
// //       "rid": 61,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 31,
// //       "hotel_id": 1,
// //       "room_type_id": 3,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 6000,
// //       "status": "rejected",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     },
// //     {
// //       "rid": 62,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 31,
// //       "hotel_id": 1,
// //       "room_type_id": 2,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 3000,
// //       "status": "rejected",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     }
// //   ],
// //   [
// //     {
// //       "rid": 63,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 32,
// //       "hotel_id": 1,
// //       "room_type_id": 3,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 6000,
// //       "status": "cancelled",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     },
// //     {
// //       "rid": 64,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 32,
// //       "hotel_id": 1,
// //       "room_type_id": 2,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 3000,
// //       "status": "cancelled",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     }
// //   ],
// //   [
// //     {
// //       "rid": 65,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 33,
// //       "hotel_id": 1,
// //       "room_type_id": 3,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 6000,
// //       "status": "completed",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     },
// //     {
// //       "rid": 66,
// //       "booked_date": "2024-04-23",
// //       "start_date": "2024-05-09",
// //       "end_date": "2024-05-12",
// //       "gid": 33,
// //       "hotel_id": 1,
// //       "room_type_id": 2,
// //       "No_of_rooms": 3,
// //       "No_of_guests": 3,
// //       "payment": 3000,
// //       "status": "completed",
// //       "createdAt": "2024-04-22T18:43:05.479Z",
// //       "updatedAt": "2024-04-22T18:43:05.479Z",
// //       "user_id": 52,
// //       "Review": null,
// //       "Rating": null,
// //       "image_id": 1,
// //       "image": "hotel2.jpg"
// //     }
// //   ]
// // ];


// // function History() {

// //   const [reservationList, setReservationList] = useState(initialReservationList)

// //   initialReservationList = [...reservationList]


// //   return (
// //     <div>
// //         <div className="fixed top-0 w-full z-10 mb-20">
// //             <NavBar   />
// //         </div>
// //         <div className="m-10"> <p>h</p></div>
// //         <div className="mt-10"> 
// //                 {reservationList.map(reservation => (
// //                     // <div className="mt-20">
// //                      <ReservationCard
// //                         key = {reservation[0].gid}
// //                         name={reservation.name}
// //                         checkin={reservation[0].start_date}
// //                         checkout={reservation[0].end_date}
// //                         noGuest={reservation[0].No_of_guests}
// //                         noRoom={reservation[0].No_of_rooms}
// //                         rid={reservation[0].gid}
// //                         status = {reservation[0].status}
// //                         setReservationList = {setReservationList}
// //                         reservationList = {reservationList}
// //                     />
// //                     // </div>
                    
// //                 ))}
// //         </div>    
// //         {/* {console.log(initialReservationList)} */}
        
// //     </div>
// //   );
// // }

// // export default History;

// import React from 'react';

// function ReservationCard(props) {
//     const handleCancelBooking = () => {
//       props.setReservationList(prevList => {
//         return prevList.map(group => {
//           return group.map(reservation => {
//             if (reservation.gid === props.rid) {
//               return { ...reservation, status: "cancelled" };
//             }
//             return reservation;
//           });
//         });
//       });
//     };
  
//     return (
//         <div className="w-3/5 bg-white rounded-lg shadow-lg p-8 mx-auto mt-8">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                     <img src="https://via.placeholder.com/150" alt="Placeholder" className="w-32 h-32 object-cover rounded-lg mr-8" />
//                     <div>
//                         <h1 className="text-2xl font-bold">{props.name}</h1>
//                         <p className="text-gray-500">{props.checkin} - {props.checkout}.</p>
//                         <p className="text-gray-500">{props.noGuest} Guest, {props.noRoom} Room </p>
//                     </div>
//                 </div>
//                 <div>
//                     <h2 className="text-lg font-semibold">{props.rid}</h2>
//                 </div>
//                 <div className='flex flex-col items-center'>
//                     {props.status === 'pending' || props.status === 'confirmed' ? (
//                         <button onClick={() => handleCancelBooking()} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Cancel Booking</button>
//                     ) : (
//                         <button className="bg-gray-400 text-gray-800 px-4 py-2 rounded mt-4" disabled>Cancel Booking</button>
//                     )}
//                     <p className="text-black-500">{props.status} </p>
//                 </div>
//             </div>
//         </div>
//     );
//   }

// export default ReservationCard;

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Manager_NavBar from "../components/Manager_navbar";
import axiosInstance from "../helpers/axios";
import Loading from "../components/Loading";


function Manager_calendar() {
    const [selectedDates, setSelectedDates] = useState([]);
    const [highlightDates, sethighlightDates] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [newPrice, setNewPrice] = useState(0);
    const [newRooms, setNewRooms] = useState(0);
    const today = new Date();
    const nextThreeMonths = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    const [calendarData, setCalendarData] = useState([]);
    const [roomTypeFilter, setRoomTypeFilter] = useState(0);
    const [mainData, setMainData] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [roomTypeIDs, setRoomTypeIDs] = useState([]);
    const  [roomTypeIDs, setRoomTypeIDs] = useState([]);
    var prices = {}
    var availableRooms = {}
    // var roomTypeFilter = 0;


    useEffect(()=>{
        setLoading(true);
        axiosInstance.get('/calendar', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            if (response.status === 200) {
                const calendarData = response.data.Data.calendar;
                const tempRoomTypeIDs = [];
                for (const roomId in calendarData) {
                    if (calendarData.hasOwnProperty(roomId)) {
                        const roomData = calendarData[roomId];
                        if (roomData.length > 0) {
                            const roomTypeName = roomData[0].room_type_name;
                            tempRoomTypeIDs.push({ room_type_id: parseInt(roomId), room_type_name: roomTypeName });
                        }
                    }
                }
                setRoomTypeIDs(tempRoomTypeIDs);
                
                console.log(roomTypeIDs);
                const mergedData = Object.entries(calendarData).map(([roomTypeId, data]) => {
                    return data.map(item => ({ ...item, room_type_id: parseInt(roomTypeId) }));
                }).flat();
                setMainData(mergedData);
                console.log(mergedData)
                // const staringData = filterByRoomTypeId(mergedData, roomTypeIDs[0])
                // setCalendarData(startingData);
                setRoomTypeFilter(tempRoomTypeIDs.room_type_id)
            }
        })
        .finally(() => {
            setLoading(false); // Set loading to false when the request is completed (whether success or failure)
        });

    },[] )

    // console.log(roomTypeFilter)

    useEffect(() => {
        setLoading(true);
        console.log("room type filter is ", roomTypeFilter);
        if (roomTypeFilter !== null && roomTypeFilter !== undefined) {            
            console.log("room type filter is ", roomTypeFilter)
            setCalendarData(filterByRoomTypeId(mainData, roomTypeFilter))
        }
        setLoading(false);
    }, [roomTypeFilter]);
    
    console.log(mainData[Object.keys(mainData)[0]])
    function filterByRoomTypeId(data, roomTypeId) {
        return data.filter(item => item.room_type_id === roomTypeId);
    }

    console.log("room Type ids is ", roomTypeIDs)

    const handleRoomTypeChange = async (event) => {
        const selectedRoomType = event.target.value;
        console.log('at function', selectedRoomType)
        setRoomTypeFilter(parseInt(selectedRoomType));
        
        
        // console.log(calendarData)
    };


    // function formatDates (arr){
    // return(    
    mainData.forEach(entry => {
        const date = new Date(entry.date);

        const year = date.getFullYear();
        const month = date.toLocaleString('en-us', { month: 'short' });
        const day = date.getDate();
        const dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });
        const formattedDay = day < 10 ? `0${day}` : day;

        const formattedDate = `${dayOfWeek} ${month} ${formattedDay} ${year}`;
        prices[formattedDate] = parseFloat(entry.price);
        availableRooms[formattedDate] = entry.no_of_avail_rooms;
    })
    // );
    // }
    
    

    const handleDateChange = (dates) => {
        sethighlightDates(dates);

        const newSelectedDates = [];
        if (!Array.isArray(dates) || dates.length === 0) return;

        const [startDate, endDate] = dates;
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            newSelectedDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1); 
        }
        setSelectedDates(newSelectedDates);
    };

    const selectedPrices = selectedDates.map(date => prices[date.toDateString()]);
    const minPrice = Math.min(...selectedPrices);
    const maxPrice = Math.max(...selectedPrices);

    const selectedRooms = selectedDates.map(date => availableRooms[date.toDateString()]);
    const minRooms = Math.min(...selectedRooms);
    const maxRooms = Math.max(...selectedRooms);


    const tileContent = ({ date }) => {
        const price = prices[date.toDateString()];
        const rooms = availableRooms[date.toDateString()];
        return (
            <div>
                {price && <p style={{ marginTop: "5px" }}> {price}</p>}
                {rooms && <p style={{ marginTop: "5px" }}> {rooms}</p>}
            </div>
        );
    };

    const handleEditClick = () => {
        setEditMode(true);
        setNewPrice(minPrice === maxPrice ? minPrice.toString() : `${minPrice}-${maxPrice}`);
        setNewRooms(minRooms === maxRooms ? minRooms.toString() : `${minRooms}-${maxRooms}`);
    };

    const handleSaveChanges = () => {
        if (!newPrice || newPrice.trim() === "") {
            alert("Please enter a valid price.");
            return;
        }

        if (!newRooms || newRooms.trim() === "") {
            alert("Please enter a valid Rooms number.");
            return;
        }

        const isRangeFormat1 = /^\d+-\d+$/.test(newPrice);
        const isRangeFormat2 = /^\d+-\d+$/.test(newRooms);

        let updatedPrices = { ...prices };

        if (!isRangeFormat1) {
            selectedDates.forEach(date => {
                updatedPrices[date.toDateString()] = newPrice;
            });
         }
        prices = { ...updatedPrices }


       let updatedRooms= { ...availableRooms }; 
       if (!isRangeFormat2) { 
            selectedDates.forEach(date => {
                updatedRooms[date.toDateString()] = newRooms; 
            });
        }
        availableRooms = { ...updatedRooms }

        setEditMode(false);
    };

    const getTodayResults = () => {
        const today = new Date();
        const todayDateString = today.toDateString();
        const todayPrice = prices[todayDateString];
        const todayRooms = availableRooms[todayDateString];
        return { todayDateString, todayPrice, todayRooms };
    };

    const renderTodayResults = () => {
        const { todayDateString, todayPrice, todayRooms } = getTodayResults();
        return (
            <div>
            <h3 className="text-sm font-semibold mb-2"> {todayDateString} </h3>
                <p>Price: {todayPrice}</p>
                <p>Available Rooms: {todayRooms}</p>
            </div>
        );
    };


    return (
        <div>
        {loading ? (
            <Loading />
          ) : (
        <div className="flex flex-col h-screen">
            <Manager_NavBar />
            <div className="flex flex-1 mt-[100px]">
                <div className="w-1/2 p-4 border-r border-gray-200">
                <label htmlFor="roomTypeFilter">Select Room Type:</label>
                <select 
                        id="roomTypeFilter" 
                        value={roomTypeFilter} 
                        onChange={(e) => handleRoomTypeChange(e)}
                    >
                        {roomTypeIDs.map(roomType => (
                            <option key={roomType.room_type_id} value={roomType.room_type_id}>
                                {roomType.room_type_name}
                            </option>
                        ))}
                    </select>
                    <h2 className="text-lg font-semibold mb-4">Calendar</h2>
                    <Calendar
                        onChange={handleDateChange}
                        value={highlightDates}
                        selectRange={true}
                        minDate={today}
                        maxDate={nextThreeMonths}
                        tileContent={tileContent} // Custom tile content
                    />
                </div>
                <div className="w-1/2 p-4">
                    <h2 className="text-lg font-semibold mb-4">Prices and Available Rooms</h2>
                    {highlightDates.length === 0 && renderTodayResults()}

                    {highlightDates.length === 2 && (
                        <p className="mb-2">
                            {highlightDates[0].toDateString()} - {highlightDates[1].toDateString()}
                        </p>
                    )}   
                    
                    {    
                    editMode ? (
                        <div>
                            <p>Price: </p>
                            <input
                                type="text"
                                placeholder="Enter new price"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
                            <p>Available Rooms: </p>
                            <input
                                type="text"
                                placeholder="Enter new available rooms"
                                value={newRooms}
                                onChange={(e) => setNewRooms(e.target.value)}
                            />
                            <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={handleSaveChanges}>
                                Save Changes
                            </button>
                        </div>
                        ) : (
                            highlightDates.length === 2 && (    
                        <div>
                            {minPrice !== maxPrice && (
                                <p className="mb-2">
                                    Price Range: {minPrice} - {maxPrice}
                                </p>
                            )}
                            {minPrice === maxPrice && (
                                <p className="mb-2">
                                    Price: {minPrice}
                                </p>
                            )}
                            {minRooms !== maxRooms && (
                                <p className="mb-2">
                                    Vacant Rooms: {minRooms} - {maxRooms}
                                </p>
                            )}
                            {minRooms === maxRooms && (
                                <p className="mb-2">
                                    Rooms: {minRooms}
                                </p>
                            )}
                            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleEditClick}>
                                Edit
                            </button>
                        </div>
                        )
                    )}
                </div>
            </div>
        </div>
                )}
                </div>
    );
}

export default Manager_calendar;





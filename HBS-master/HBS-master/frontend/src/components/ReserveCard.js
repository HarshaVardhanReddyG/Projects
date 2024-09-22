import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useParams } from 'react-router-dom';
import axiosInstance from '../helpers/axios';

function ReserveCard(props) {
    const [start_Date, setStart_Date] = useState(null);
    const [end_Date, setEnd_Date] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [numGuests, setNumGuests] = useState('');
    const [isRoomSelectionVisible, setIsRoomSelectionVisible] = useState(false);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const roomSelectionRef = useRef(null);
    const { hotelId, no_of_guests, start_date, end_date } = useParams();
    const Navigate = useNavigate()

    useEffect(() => {
        function handleClickOutside(event) {
            if (roomSelectionRef.current && !roomSelectionRef.current.contains(event.target)) {
                setIsRoomSelectionVisible(false); // Hide room selection if clicked outside
            }
        }

        // Attach event listener when the component mounts
        if (isRoomSelectionVisible) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isRoomSelectionVisible]); // Empty dependency array ensures that this effect runs only once


    useEffect(() =>{
        setEnd_Date(end_date);
        setStart_Date(start_date);
        setNumGuests(no_of_guests);
    },[no_of_guests])

    useEffect(() => {
        const combinedRoomTypes = props.RoomTypes.map(roomType => ({
            ...roomType,
            count: 0,
            min_vacant_rooms: 0
        }));

        props.VacantRooms.forEach(vacantRoom => {
            const index = combinedRoomTypes.findIndex(roomType => roomType.room_type_id === vacantRoom.room_type_id);
            if (index !== -1) {
                combinedRoomTypes[index].min_vacant_rooms = vacantRoom.min_vacant_rooms;
            }
        });

        setRoomTypes(combinedRoomTypes);
    }, [props.RoomTypes, props.VacantRooms]);

    const handleReserve = (e) => {
        e.preventDefault();
        let token = localStorage.getItem('token');
        if(token === null){
            Navigate('/login')
        }
        if (roomTypes) {
            axiosInstance.post('/reserve', {
                room_types: roomTypes,
                hotel_id: hotelId,
                no_of_guests: numGuests,
                start_date: start_Date,
                end_date: end_Date
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    console.log(response.data)
                    setReservationDetails(response.data);
                    setShowModal(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleIncrement = (roomType) => {
        const updatedRoomTypes = roomTypes.map(room => {
            if (room.room_type_name === roomType.room_type_name && room.count + 1 <= room.min_vacant_rooms) {
                return {
                    ...room,
                    count: room.count + 1
                };
            }
            return room;
        });

        setRoomTypes(updatedRoomTypes);
    };

    const handleDecrement = (roomType) => {
        const updatedRoomTypes = roomTypes.map(room => {
            if (room.room_type_name === roomType.room_type_name && room.count > 0) {
                return {
                    ...room,
                    count: room.count - 1
                };
            }
            return room;
        });

        setRoomTypes(updatedRoomTypes);
    };

    const handleRoomsInputFocus = () => {
        setIsRoomSelectionVisible(true);
    };

    const handleRoomsInputBlur = () => {
        setIsRoomSelectionVisible(false);
    };

    const renderRoomTypes = () => {
        return roomTypes.map((room, index) => (
            <div key={index} className="room-type flex justify-between items-center">{room.room_type_name}
                {console.log(room)}
                <div className="flex justify-center">
                    <button onClick={() => handleDecrement(room)} className={`minus-button m-2 rounded-full border border-gray-300 ${room.count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={room.count === 0}><RemoveIcon /></button>
                    <div className="room-count m-2">{room.count}</div>
                    <button onClick={() => handleIncrement(room)} className={`plus-button m-2 rounded-full border border-gray-300 ${
                        room.count === parseInt(room.min_vacant_rooms) ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={room.count === parseInt(room.min_vacant_rooms) }> <AddIcon /></button>
                </div>
            </div>
        ));
    };

    const closeModal = () => {
        setShowModal(false);
        setReservationDetails(null);
    };


    const handleCancel = (e) =>{
        e.preventDefault()
        setShowModal(false);
        let token = localStorage.getItem('token');
        if(reservationDetails.gid){
           axiosInstance.post('/confirm',{
               gid : reservationDetails.gid.gid,
               status: "cancelled"
           },{
            headers: {
                Authorization: `Bearer ${token}`
            }
           }).then((response)=>{
               window.confirm(response.data.message.message)
           })
        }
        setReservationDetails(null)
    }

    const handleConfirm = (e) =>{
        e.preventDefault()
        setShowModal(false);
        if(reservationDetails.gid){
           axiosInstance.post('/confirm',{
               gid : reservationDetails.gid.gid,
               status: "confirmed"
           },{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            const confirmationMessage = response.data.message.message;
            const confirmed = window.confirm(`${confirmationMessage} Redirecting to bill`);
            if (confirmed) {
                Navigate(`/bill/${reservationDetails.gid.gid}`)
            } else {
                console.log("Bye"); // Log Bye if not confirmed
            }
        }).catch(error => {
            console.error("Error confirming reservation:", error);
        });
    }
    setReservationDetails(null);

    }

    return (
        <div className="max-w-10em mx-auto bg-white p-6 rounded-md mt-4 shadow-md border border-gray-300">
            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-grow">
                    <DatePicker
                        selected={start_Date}
                        onChange={date => setStart_Date(date)}
                        selectsStart
                        maxDate={end_Date}
                        placeholderText="Check in"
                        className="w-full rounded-md px-4 py-2 border border-gray-300"
                    />
                </div>
                <div className="flex-grow">
                    <DatePicker
                        selected={end_Date}
                        onChange={date => setEnd_Date(date)}
                        selectsEnd
                        minDate={start_Date}
                        placeholderText="Check Out"
                        className="w-full rounded-md px-4 py-2 border border-gray-300"
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
                <div className="flex-grow relative" ref={roomSelectionRef}>
                    <input
                        id="num_rooms"
                        placeholder="Rooms"
                        value=""
                        onClick={handleRoomsInputFocus}
                        className="w-full rounded-md px-4 py-2 border border-gray-300"
                        readOnly
                    />
                    {isRoomSelectionVisible && (
                        <div className="room-container shadow-lg border border-gray-200 rounded-lg mt-2 p-4">
                            {renderRoomTypes()}
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <input type="number" placeholder="Guests" value={numGuests} onChange={(e) => setNumGuests(e.target.value)} className="w-full rounded-md px-4 py-2 border border-gray-300" />
                </div>
            </div>
            <div className="mt-4">
                <a className="bg-pink-500 text-white px-4 py-2 rounded-md block w-full" onClick={(e) => handleReserve(e)}>Reserve</a>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
                    <div className="bg-white p-6 rounded-md max-w-2xl z-10">
                        <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(reservationDetails.totalPrice).map((key, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="px-6 py-4 whitespace-nowrap">{reservationDetails.totalPrice[key].room_type_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservationDetails.totalPrice[key].total_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 flex justify-end">
                            <button onClick={(e)=>handleCancel(e)} className="mr-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
                            <button onClick={(e)=>handleConfirm(e)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReserveCard;

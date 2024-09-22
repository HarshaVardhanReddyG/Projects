import React, { useState } from "react";
import { useEffect } from "react";
import axiosInstance from '../helpers/axios'

function RoomForm({ handlePrevious }) {

    const [formData2, setFormData2] = useState({
        rooms: [
            { id: '1', roomType: 'Single Room', amenities: ['TV', 'Air Conditioning'], availableRooms: 10, defaultPrice: 100, max_of_guests: 1 },
            { id: '2', roomType: 'Double Room', amenities: ['TV', 'Kitchen'], availableRooms: 5, defaultPrice: 150, max_of_guests: 2 },
        ],
        faqs: []
    });
    const [amPopup, setAmPopup] = useState(false);
    const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
    const [newFAQ, setNewFAQ] = useState({
        question: '',
        answer: '',
    });


    const handlefetch = () => {
        axiosInstance.get('/hotel_room_faqs', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    const { HotelDetails } = response.data;
                    const roomTypes = HotelDetails.RoomTypes.map(room => ({
                        id: room.room_type_id,
                        roomType: room.room_type_name,
                        amenities: room.list_of_amenties.split(',').map(item => item.trim()),
                        availableRooms: room.no_of_rooms,
                        defaultPrice: room.default_price,
                        max_of_guests: room.max_guests
                    }));
                    const faqs = HotelDetails.FAQs.map(faq => ({
                        id: faq.faq_id,
                        question: faq.Q,
                        answer: faq.A,
                        editable: false
                    }));
                    setFormData2({ rooms: roomTypes, faqs: faqs });
                }
            })
    }

    useEffect(() => {
        handlefetch()
    }, [])





    const handleRoomInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRooms = [...formData2.rooms];
        updatedRooms[index][name] = value;
        setFormData2({
            ...formData2,
            rooms: updatedRooms
        });
    };

    const selectAmenities = (index) => {
        setAmPopup(true);
        setCurrentRoomIndex(index);
    };

    const closeAmenitiesPopup = () => {
        setAmPopup(false);
    };


    const handleDeleteRoom = async (index) => {
        const id = formData2.rooms[index].id
        axiosInstance.delete(`/delete_room_types/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    window.alert(response.data.message)
                    if (response.data.code == 1) {
                        const updatedRooms = formData2.rooms.filter((room, i) => i !== index);
                        setFormData2({
                            ...formData2,
                            rooms: updatedRooms
                        });
                    }
                }
            })
    };

    const am = [
        "Wifi", "TV", "Kitchen", "Washing Machine", "Air Conditioning",
        "Dedicated work space", "Free Parking on Premises", "Pool", "Piano",
        "Smoke alarm", "Fire Extingusher", "Carbon Monoxide Alarm", "First Aid Kit"
    ];

    const rooms_am = [
        "TV", "Kitchen", "Washing Machine", "Air Conditioning",
        "Dedicated work space", "Essentials", "Ceiling Fan", "Fridge", "Micro Wave",
    ];



    const saveFAQChanges = async (index) => {
        try {
            console.log({ faq: { faq_id: formData2.faqs[index].id, Q: formData2.faqs[index].question, A: formData2.faqs[index].answer } })
            const response = await axiosInstance.put('/update_faqs', {
                faq:
                    { faq_id: formData2.faqs[index].id, Q: formData2.faqs[index].question, A: formData2.faqs[index].answer }
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                window.alert(response.data.message.message);
                const updatedFAQs = [...formData2.faqs];
                updatedFAQs[index].editable = false;
                setFormData2({
                    ...formData2,
                    faqs: updatedFAQs,
                });
            } else {
                console.error("Error updating FAQ:", response.data.error);
            }
        } catch (error) {
            console.error("Error updating FAQ:", error);
            window.alert("Error updating FAQ. Please try again."); // Display error message
        }
    };

    const setFAQEditable = (index, editable) => {
        const updatedFAQs = [...formData2.faqs];
        updatedFAQs[index].editable = editable; // Set editable state
        setFormData2({
            ...formData2,
            faqs: updatedFAQs,
        });
    };

    const handleDeleteFAQ = async (index) => {
        try {

            let faq_id = formData2.faqs[index].id
            console.log(formData2.faqs[index].id)
            const response = await axiosInstance.delete(`/delete_faqs/${faq_id}`);
            if (response.status === 200) {
                const updatedFAQs = [...formData2.faqs];
                updatedFAQs.splice(index, 1);
                setFormData2({
                    ...formData2,
                    faqs: updatedFAQs,
                });
                window.alert(response.data.message.message)
                console.log(response.data.message); // Log success message
            } else {
                console.error("Error deleting FAQ:", response.data.error);
            }
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };

    const handleFAQInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFAQs = [...formData2.faqs];
        updatedFAQs[index][name] = value;
        setFormData2({
            ...formData2,
            faqs: updatedFAQs,
        });
    };

    const addNewFAQ = async () => {
        if (newFAQ.question && newFAQ.answer) {
            const response = await axiosInstance.post('/add_faqs', { faqs: [{ Q: newFAQ.question, A: newFAQ.answer }] }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                if (response.data.id) {
                    window.alert(response.data.message)
                    setFormData2({
                        ...formData2,
                        faqs: [...formData2.faqs, { question: newFAQ.question, answer: newFAQ.answer, editable: false }],
                    });
                    setNewFAQ({ question: '', answer: '' });
                }

            }
            else {
                window.alert(response.data.error)
            }

        }
    };

    const [newRoom, setNewRoom] = useState({ roomType: '', availableRooms: 0, defaultPrice: 0, amenities: [], max_of_guests: 1 });

    const [newRoomPopup, setNewRoomPopup] = useState(false);

    const selectNewRoomAmenities = () => {
        setNewRoomPopup(true);
    };

    const closeNewRoomPopup = () => {
        setNewRoomPopup(false);
    };

    const handleNewRoomAmenitiesChange = (e) => {
        const { value } = e.target;
        const updatedAmenities = [...newRoom.amenities];

        if (updatedAmenities.includes(value)) {
            const index = updatedAmenities.indexOf(value);
            updatedAmenities.splice(index, 1);
        } else {
            updatedAmenities.push(value);
        }

        setNewRoom({
            ...newRoom,
            amenities: updatedAmenities,
        });
    };

    const addNewRoom = async (e) => {
        e.preventDefault()
        if (newRoom.roomType && newRoom.availableRooms && newRoom.defaultPrice && newRoom.amenities.length > 0) {
            axiosInstance.post('/add_room_types', {
                room_types: [{ name: newRoom.roomType, list_of_amenties: newRoom.amenities.join(","), no_of_rooms: newRoom.availableRooms, default_price: 100, max_guests: 1 }]
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                console.log('new Room', response)
                if (response.status === 200) {
                    {
                        const newRoomWithId = { ...newRoom, id: response.data.id };
                        setFormData2({
                            ...formData2,
                            rooms: [...formData2.rooms, newRoomWithId],
                        });
                        setNewRoom({
                            roomType: '',
                            availableRooms: 0,
                            defaultPrice: 0,
                            amenities: [],
                            max_of_guests: 1
                        });
                        setNewRoomPopup(false);
                    }
                }
                window.alert('New RoomType added sucessfully')
            })
                .catch((error) => {

                    console.error(error)
                })

        }


    };
    const handleSubmit1 = () => {
        console.log()
    }


    return (

        <div>
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Let us know about your rooms</h1>

                <div className="grid grid-cols-6 gap-4 mb-4">
                    <div>Room Type</div>
                    <div>Amenities</div>
                    <div>Available Rooms</div>
                    <div>Default Price</div>
                    <div>Max Guests</div>
                    <div></div>
                </div>

                {formData2.rooms.map((room, index) => (
                    <div key={index} className="grid grid-cols-6 gap-4 mb-4">
                        <input
                            type="text"
                            name="roomType"
                            value={room.roomType}
                            readOnly={!room.editable}
                            onChange={(e) => handleRoomInputChange(index, e)}
                            className="border border-gray-300 rounded-md px-4 py-2 col-span-1"
                        />
                        <div className="col-span-1">
                            <button
                                onClick={() => selectAmenities(index)}
                                className="bg-white-500  border border-gray-500 px-4 py-2 rounded-md"
                            >
                                Show Amenities
                            </button>
                        </div>
                        <input
                            type="number"
                            name="availableRooms"
                            value={room.availableRooms}
                            readOnly={!room.editable}
                            onChange={(e) => handleRoomInputChange(index, e)}
                            className="border border-gray-300 rounded-md px-4 py-2 col-span-1"
                        />
                        <input
                            type="number"
                            name="defaultPrice"
                            value={room.defaultPrice}
                            readOnly={!room.editable}
                            onChange={(e) => handleRoomInputChange(index, e)}
                            className="border border-gray-300 rounded-md px-4 py-2 col-span-1"
                        />
                        <input
                            type="number"
                            name="max_of_guests"
                            value={room.max_of_guests}
                            readOnly={!room.editable}
                            onChange={(e) => handleRoomInputChange(index, e)}
                            className="border border-gray-300 rounded-md px-4 py-2 col-span-1"
                        />
                        <div className="flex items-center justify-center space-x-2 col-span-1">
                            <button onClick={() => handleDeleteRoom(index)} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                <span className="text-xs">-</span>
                            </button>
                        </div>
                    </div>
                ))}

                <button onClick={() => handlePrevious()} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">Previous</button>

                {amPopup && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Selected Amenities</h2>
                            <div>
                                <ul>
                                    {formData2.rooms[currentRoomIndex].amenities.map((amenity, index) => (
                                        <li key={index}>{amenity}</li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => closeAmenitiesPopup()} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 ml-4">Close</button>
                        </div>
                    </div>


                )}
                <div className="grid grid-cols-5 gap-4 mb-4 mt-2">
                    <input
                        type="text"
                        name="roomType"
                        value={newRoom.roomType}
                        onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                        placeholder="Room Type"
                        className="border border-gray-300 rounded-md px-4 py-2"
                    />
                    <div>
                        <button
                            onClick={selectNewRoomAmenities}
                            className="bg-white-500 border border-gray-500 px-4 py-2 rounded-md"
                        >
                            Select Amenities
                        </button>
                    </div>
                    <input
                        type="number"
                        name="availableRooms"
                        value={newRoom.availableRooms}
                        onChange={(e) => setNewRoom({ ...newRoom, availableRooms: e.target.value })}
                        placeholder="Available Rooms"
                        className="border border-gray-300 rounded-md px-4 py-2"
                    />
                    <input
                        type="number"
                        name="defaultPrice"
                        value={newRoom.defaultPrice}
                        onChange={(e) => setNewRoom({ ...newRoom, defaultPrice: e.target.value })}
                        placeholder="Default Price"
                        className="border border-gray-300 rounded-md px-4 py-2"
                    />
                      <input
                        type="number"
                        name="max_of_guests"
                        value={newRoom.max_of_guests}
                        onChange={(e) => setNewRoom({ ...newRoom, max_of_guests: e.target.value })}
                        placeholder="Max guests"
                        className="border border-gray-300 rounded-md px-4 py-2"
                    />
                    <button onClick={(e)=>addNewRoom(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Room</button>
                </div>

                {newRoomPopup && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Select Amenities</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {rooms_am.map((amenity, index) => (
                                    <div key={index}>
                                        <input
                                            type="checkbox"
                                            name={`new_room_amenity_${index}`}
                                            value={amenity}
                                            className="mr-2"
                                            onChange={handleNewRoomAmenitiesChange}
                                            checked={newRoom.amenities.includes(amenity)}
                                        />
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                            <button onClick={closeNewRoomPopup} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 ml-4">Close</button>
                        </div>
                    </div>
                )}

            </div>


            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">FAQs</h1>

                {formData2.faqs.map((faq, index) => (
                    <div key={index} className="mb-4">
                        <div className="pl-6">
                            <span className="font-bold">{index + 1}:</span>
                            {faq.editable ? (
                                <textarea name="question" value={faq.question} onChange={(e) => handleFAQInputChange(index, e)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            ) : (
                                <div className="border border-gray-300 rounded-md p-2">
                                    <p>{faq.question}</p>
                                </div>
                            )}
                        </div>
                        <div className="pl-6">
                            <span className="font-bold">Ans: </span>
                            {faq.editable ? (
                                <textarea name="answer" value={faq.answer} onChange={(e) => handleFAQInputChange(index, e)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            ) : (
                                <div className="border border-gray-300 rounded-md p-2">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            {faq.editable ? (
                                <button onClick={() => saveFAQChanges(index)} className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">Save</button>
                            ) : (
                                <button onClick={() => setFAQEditable(index, true)} className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
                            )}
                            <button onClick={() => handleDeleteFAQ(index)} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                <span className="text-xs">-</span>
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Add New FAQ</h3>
                    <input type="text" name="question" value={newFAQ.question} onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })} placeholder="Question" className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2" />
                    <textarea name="answer" value={newFAQ.answer} onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })} placeholder="Answer" className="w-full border border-gray-300 rounded-md px-4 py-2" />
                    <button onClick={addNewFAQ} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Add FAQ</button>
                </div>
            </div>

        </div>

    );

}

export default RoomForm;
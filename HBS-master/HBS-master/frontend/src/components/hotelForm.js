import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axios";
import Loading from "./Loading";

function HotelForm({handleNext}) {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: 'Example Hotel',
        description: 'This is a dummy hotel for testing purposes.',
        location: 'Test Location',
        address: '123 Test Street',
        latitude: '40.7128',
        longitude: '-74.0060',
        amenities: ['Wifi', 'Pool'],
        cancellationPolicy: 1,
        checkInTime: '1:00',
        checkOutTime: '12:00',
        
    });

    useEffect(() => {
        setLoading(true); // Set loading to true when the effect starts

        axiosInstance.get('hotel', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((response) => {
            if (response.data) {
                let Hotel = response.data.HotelDetails.Hotel
                setFormData({
                    name: Hotel.Hotel_name || '',
                    description: Hotel.Description || '',
                    location: Hotel.Location || '',
                    address: Hotel.Address || '',
                    latitude: Hotel.latitude || '',
                    longitude: Hotel.longitude || '',
                    amenities: Hotel.list_of_amenities.split(',') || [''],
                    cancellationPolicy: Hotel.cancellation_policy || 0,
                    checkInTime: Hotel.check_in || '9:00',
                    checkOutTime: Hotel.check_out || '9:00',
                });
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

    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAmenitiesChange = (e) => {
        const { value } = e.target;
        const amenities = [...formData.amenities];

        if (amenities.includes(value)) {
            const index = amenities.indexOf(value);
            amenities.splice(index, 1);
        } else {
            amenities.push(value);
        }

        setFormData({
            ...formData,
            amenities
        });
    };



    const am = [
        "Wifi", "Elevator", "External Power Source", "Free Parking on Premises", "Pool", "Piano",
        "Smoke alarm", "Fire Extingusher", "Carbon Monoxide Alarm", "First Aid Kit"
      ];




    const handleSubmit = async(e) => {
        e.preventDefault()
        for (const key in formData) {
            if (formData[key] === '') {
                setErrorMessage(`Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }
        if (formData.amenities.length < 2) {
            setErrorMessage('Please select two or more amenities');
            return;
        }

        if (formData.description.length > 500) {
            setErrorMessage('Description must be less than 500 characters');
            return;
        }
        console.log(formData)
        try {
            const response = await axiosInstance.post('update_hotel',formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },formData);
            if(response.status === 200)
                alert("Submitted Succesfully")
            console.log(response.data); 
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <div className="flex justify-center items-center">
                           {loading ? (
                // Display loading indicator while waiting for data
                <Loading />
            ) : (
                <div className="grid grid-cols-2 gap-8 w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Edit Hotel Info</h1>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <p>Name:</p>
                                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <div>
                                <p>Description:</p>
                                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <div>
                                <p>Location:</p>
                                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <div>
                                <p>Address:</p>
                                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <div>
                                <p>Latitude:</p>
                                <input type="text" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <div>
                                <p>Longitude:</p>
                                <input type="text" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                        </form>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <p className="font-semibold">Amenities:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {am.map((amenity, index) => (
                                        <label key={index} className="flex items-center">
                                            <input type="checkbox" name={amenity.toLowerCase()} value={amenity} onChange={handleAmenitiesChange} checked={formData.amenities.includes(amenity)} className="mr-2" />
                                            {amenity}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p>Cancellation Policy:</p>
                                <input type="number" name="cancellationPolicy" placeholder="Cancellation Policy" value={formData.cancellationPolicy} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <div>
                                <p>Check-in Time:</p>
                                <input type="text" name="checkInTime" placeholder="Check-in Time" value={formData.checkInTime} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <div>
                                <p>Check-out Time:</p>
                                <input type="text" name="checkOutTime" placeholder="Check-out Time" value={formData.checkOutTime} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                            </div>
                            <button onClick={(e)=>handleSubmit(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
                            <button onClick={(e) => handleNext(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Next</button>
                        </form>
                    </div>
                </div>
            
                                )
      }
        </div>
    );
}

export default HotelForm;

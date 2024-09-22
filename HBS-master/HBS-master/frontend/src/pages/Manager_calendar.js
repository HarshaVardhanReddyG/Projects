import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Manager_NavBar from "../components/Manager_navbar";
import axiosInstance from "../helpers/axios";


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
    var prices = {}
    var availableRooms = {}
    // var roomTypeFilter = 0;


    useEffect(()=>{
        axiosInstance.get('/calendar', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            if (response.status === 200) {
                const calendarData = response.data.Data.calendar;
                const updatedCalendarData = {};
                Object.entries(calendarData).forEach(([roomTypeId, data]) => {
                    updatedCalendarData[roomTypeId] = data.map(item => ({ ...item, room_type_id: parseInt(roomTypeId) }));
                });
                setCalendarData(updatedCalendarData);
                console.log("updatedCalendarData", updatedCalendarData);
                console.log("calendar data is ", calendarData)
                setMainData(updatedCalendarData);
                console.log("mainData is ", mainData)
                setCalendarData(updatedCalendarData[Object.keys(calendarData)[0]]);
                
            }
        })
    },[] )

    // console.log("mainData is ", mainData)
    // console.log("calendar data is ", calendarData)

    

    const handleRoomTypeChange = async (event) => {
        const selectedRoomType = event.target.value;
        console.log('at function', selectedRoomType)
        setRoomTypeFilter(parseInt(selectedRoomType));
        setCalendarData(mainData[selectedRoomType])
        console.log("room type filter is ", roomTypeFilter)
        console.log(calendarData)
    };
    
    calendarData.forEach(entry => {
        const date = new Date(entry.date);

        const year = date.getFullYear();
        const month = date.toLocaleString('en-us', { month: 'short' });
        const day = date.getDate();
        const dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });
        const formattedDay = day < 10 ? `0${day}` : day;

        const formattedDate = `${dayOfWeek} ${month} ${formattedDay} ${year}`;
        prices[formattedDate] = parseFloat(entry.price);
        availableRooms[formattedDate] = entry.no_of_avail_rooms;
    });
    
    

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
        <div className="flex flex-col h-screen">
            <Manager_NavBar />
            <div className="flex flex-1 mt-[100px]">
                <div className="w-1/2 p-4 border-r border-gray-200">
                <label htmlFor="roomTypeFilter">Select Room Type:</label>
                    <select id="roomTypeFilter" value={roomTypeFilter} onChange={(e) => {console.log("at event", e.target.value);handleRoomTypeChange(e)}}>
                        {Object.keys(mainData).map(key => (
                            <option key={key} value={key}>{mainData[key][0].room_type_name}</option>
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
    );
}

export default Manager_calendar;



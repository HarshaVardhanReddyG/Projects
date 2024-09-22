import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Card from '../components/List_card';
import hotelsList from '../components/hotels';

function Home() {
  const [amPopup, setAmPopup] = useState(false);
  const [minPrice, setMinPrice] = useState(Math.min(...hotelsList.map(hotel => parseInt(hotel.price))));
  const [maxPrice, setMaxPrice] = useState(Math.max(...hotelsList.map(hotel => parseInt(hotel.price))));
  const [filteredHotels, setFilteredHotels] = useState([...hotelsList]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRoomAmenities, setSelectedRoomAmenities] = useState([]);
  const [sortBy, setSortBy] = useState(''); 
  const [showSortDropdown, setShowSortDropdown] = useState(false);



  const am = [
    "Wifi", "Elevator", "External Power Source", "Free Parking on Premises", "Pool", "Piano",
    "Smoke alarm", "Fire Extingusher", "Carbon Monoxide Alarm", "First Aid Kit"
  ];

  const rooms_am = [
    "TV", "Kitchen", "Washing Machine", "Air Conditioning",
   "Dedicated work space", "Essentials", "Ceiling Fan", "Fridge", "Micro Wave", 
  ];

  const applyFilters = () => {
    const filtered = hotelsList.filter(hotel => {
      const price = parseInt(hotel.price);
      const hasSelectedAmenities = selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
      const hasSelectedRoomAmenities = selectedRoomAmenities.every(roomAmenity => {
        return hotel.rooms.some(room => room.amenities.includes(roomAmenity));
      });
      return price >= parseInt(minPrice) && price <= parseInt(maxPrice) && hasSelectedAmenities && hasSelectedRoomAmenities;
    });
    setFilteredHotels(filtered);
    setAmPopup(false); // Close the popup after applying filters
  };

  const resetFilters = () => {
    setMinPrice(Math.min(...hotelsList.map(hotel => parseInt(hotel.price))));
    setMaxPrice(Math.max(...hotelsList.map(hotel => parseInt(hotel.price))));
    setFilteredHotels([...hotelsList]); 
    setSelectedAmenities([]); 
    setSelectedRoomAmenities([]);
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(item => item !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updatedAmenities);
  };

  const handleRoomAmenityChange = (amenity) => {
    const updatedRoomAmenities = selectedRoomAmenities.includes(amenity)
      ? selectedRoomAmenities.filter(item => item !== amenity)
      : [...selectedRoomAmenities, amenity];
    setSelectedRoomAmenities(updatedRoomAmenities);
  };

  const sortHotels = (hotels, sortBy) => {
    switch (sortBy) {
      case 'priceLowToHigh':
        return hotels.sort((a, b) => parseInt(a.price) - parseInt(b.price));
      case 'priceHighToLow':
        return hotels.sort((a, b) => parseInt(b.price) - parseInt(a.price));
      case 'ratingsHighToLow':
        return hotels.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      case 'ratingsLowToHigh':
        return hotels.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
      default:
        return hotels;
    }
  };


  return (
    <div className="h-screen relative">
      <NavBar /> 
      <div  className="fixed top-18 right-0 top mt-1 ">
        <button onClick={() => setAmPopup(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Show Filters</button>
      </div>
      <button onClick={() => setShowSortDropdown(!showSortDropdown)} className='fixed top-18 left-0 mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg'>Sort By</button>
      {showSortDropdown && (
            <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button onClick={() => { setSortBy('priceLowToHigh'); setShowSortDropdown(false); }} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Price (Low to High)</button>
              <button onClick={() => { setSortBy('priceHighToLow'); setShowSortDropdown(false); }} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Price (High to Low)</button>
              <button onClick={() => { setSortBy('ratingsHighToLow'); setShowSortDropdown(false); }} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Ratings (High to Low)</button>
              <button onClick={() => { setSortBy('ratingsLowToHigh'); setShowSortDropdown(false); }} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Ratings (Low to High)</button>
            </div>
          )}
      <div className=" border mt-[78px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-scroll no-scrollbar max-h-[720px]">
      {filteredHotels.length === 0 && (
        <div className='w-full h-screen flex flex-col items-center justify-center'>
            <p className='text-2xl text-gray-500'>No Hotels Found</p>
            <p className='text-l text-gray-500'>Try Resetting Filters</p>
        </div>
      )}


        {sortHotels(filteredHotels, sortBy).map(hotel => (
          <div key={hotel.id} className='m-4'>
            <Card 
              imgURL={hotel.imgURL[0]}
              name={hotel.name}
              location={hotel.location}
              rating={hotel.rating}
              price={hotel.price}
            />
          </div>
        ))}
      </div>

      {amPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-2/5 h-4/5 relative overflow-y-auto no-scrollbar">
            <button onClick={() => setAmPopup(false)} className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800"> &#x2715; </button>
            <h1 className="text-2xl mb-4">Amenities</h1>
            <div className="grid grid-cols-2 gap-2">
              {am.map((amenity, index) => (
                <div key={index} className="mb-2">
                  <input type="checkbox" id={`amenity-${index}`} name={`amenity-${index}`}  onChange={() => handleAmenityChange(amenity)} checked={selectedAmenities.includes(amenity)}/>
                  <label htmlFor={`amenity-${index}`} className="ml-2">{amenity}</label>
                </div>
              ))}
            </div>
            <h1 className="text-2xl mb-4">Rooms Amenities</h1>
            <div className="grid grid-cols-2 gap-2">
              {rooms_am.map((amenity, index) => (
                <div key={index} className="mb-2">
                   <input type="checkbox" id={`room-amenity-${index}`} name={`room-amenity-${index}`} onChange={() => handleRoomAmenityChange(amenity)} checked={selectedRoomAmenities.includes(amenity)} />
                  <label htmlFor={`amenity-${index}`} className="ml-2">{amenity}</label>
                </div>
              ))}
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="minPrice" className="text-lg mb-2">Min Price</label>
              <input id="minPrice" name="minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4 mb-4" />
              <label htmlFor="maxPrice" className="text-lg mb-2">Max Price</label>
              <input id="maxPrice" name="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4" />
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Apply</button>
              <button onClick={resetFilters} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Reset</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;

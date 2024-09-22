import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HotelCard from '../components/Hotel_card';
import NavBar from '../components/NavBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import Loading from '../components/Loading';

// Dummy data with prices as an array

// {
//   id: 1,
//   name: 'Example Hotel 1',
//   ratings: '4.5/5',
//   location: 'City A, Country X',
//   priceRange: '$$$',
//   amenities: ['Wifi', 'Parking', 'Pool'],
//   prices: [250, 350], // Min and Max prices
//   popularity: 10,// Example popularity
//   imgURL: "https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720" // Example popularity
// },
// {
//   id: 2,
//   name: 'Example Hotel 2',
//   ratings: '4.2/5',
//   location: 'City B, Country Y',
//   priceRange: '$$',
//   amenities: ['Wifi', 'Gym'],
//   prices: [150, 550], // Min and Max prices
//   popularity: 5,// Example popularity
//   imgURL: "https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720" // Example popularity
// },
// {
//   id: 3,
//   name: 'Example Hotel 3',
//   ratings: '4.7/5',
//   location: 'City C, Country Z',
//   priceRange: '$$$',
//   amenities: ['Parking', 'Restaurant'],
//   prices: [350, 450], // Min and Max prices
//   popularity: 8,// Example popularity
//   imgURL: "https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720"
// },
// {
//   id: 4,
//   name: 'Example Hotel 1',
//   ratings: '4.5/5',
//   location: 'City A, Country X',
//   priceRange: '$$$',
//   amenities: ['Wifi', 'Parking', 'Pool'],
//   prices: [250, 350], // Min and Max prices
//   popularity: 10,// Example popularity
//   imgURL: "https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720" // Example popularity
// },
// {
//   id: 5,
//   name: 'Example Hotel 2',
//   ratings: '4.2/5',
//   location: 'City B, Country Y',
//   priceRange: '$$',
//   amenities: ['Wifi', 'Gym'],
//   prices: [150, 550], // Min and Max prices
//   popularity: 5,// Example popularity
//   imgURL: "https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720" // Example popularity
// },
// {
//   id: 6,
//   name: 'Example Hotel 3',
//   ratings: '4.7/5',
//   location: 'City C, Country Z',
//   priceRange: '$$$',
//   amenities: ['Parking', 'Restaurant'],
//   prices: [350, 450], // Min and Max prices
//   popularity: 8,// Example popularity
//   imgURL: "https://a0.muscache.com/im/pictures/miso/Hosting-820733145568572294/original/0c68a135-b239-4a95-b3d6-ad89816cd922.jpeg?im_w=720" // Example popularity
// }

function HotelList() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [hotels, setHotels] = useState([]);

  const [lowPrice, setLowPrice] = useState(Math.min(...hotels.flatMap((hotel) => hotel.prices)));
  const [highPrice, setHighPrice] = useState(Math.max(...hotels.flatMap((hotel) => hotel.prices)));
  const am = [
    "Wifi", "Elevator", "External Power Source", "Free Parking on Premises", "Pool", "Piano",
    "Smoke alarm", "Fire Extingusher", "Carbon Monoxide Alarm", "First Aid Kit"
  ];

  const [loading, setLoading] = useState(true);

  const { state } = useLocation();


  useEffect(() => {
    if (state) {
      console.log(state);
      axios.get('http://localhost:5000/search',
        {
          params: {
            location: state.location,
            no_of_rooms: state.numRooms,
            no_of_guests: state.numGuests,
            start_date: state.startDate,
            end_date: state.endDate
          }
        })
        .then((response) => {
          const hotelList = response.data.hotelList.map((hotel) => ({
            id: hotel.hotel_id,
            name: hotel.Hotel_name,
            ratings: hotel.average_rating || '5',
            imgURL: `http://localhost:5000/${hotel.hotel_image}`,
            location: hotel.Location || 'Unknown',
            prices: [hotel.min_price, hotel.max_price],
            amenities: hotel.list_of_amenities ? hotel.list_of_amenities.split(', ') : ['Unknown'],
            popularity: hotel.reservations || '5',
          }));
          setHotels(hotelList);
          const prices = hotelList.map((hotel) => hotel.prices).flat();
          setLowPrice(Math.min(...prices));
          setHighPrice(Math.max(...prices));
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching hotels:', error);
        });
    } else {

    }
  }, [state]);

  console.log(hotels)


  const resetFilters = () => {

    const mergedPrices = hotels.reduce((accumulator, currentHotel) => {
      return accumulator.concat(currentHotel.prices);
    }, []);
    console.log(mergedPrices);
    setLowPrice(Math.min(...mergedPrices))
    setHighPrice(Math.max(...mergedPrices))

  };


  const handleHotelClick = (hotelId) => {
    const startDateIsoString = state.startDate.toISOString();
    const endDateIsoString = state.endDate.toISOString();

    const startDate = new Date(startDateIsoString);
    const endDate = new Date(endDateIsoString);

    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);

    const updatedStartDateIsoString = startDate.toISOString().split('T')[0];
    const updatedEndDateIsoString = endDate.toISOString().split('T')[0];

    navigate(`/hotel/${hotelId}/${state.numGuests}/${updatedStartDateIsoString}/${updatedEndDateIsoString}`);

  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sort options including ratings
  const sortOptions = [
    { label: 'Popularity', value: 'popularity' },
    { label: 'Ratings', value: 'ratings' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' }
  ];

  // Sort hotels based on selected sort option
  let sortedHotels = [...hotels];
  if (sortOption === 'popularity') {
    sortedHotels = sortedHotels.sort((a, b) => b.popularity - a.popularity); // Sort by popularity
  } else if (sortOption === 'ratings') {
    sortedHotels = sortedHotels.sort((a, b) => parseFloat(b.ratings) - parseFloat(a.ratings)); // Sort by ratings
  } else if (sortOption === 'price_asc') {
    sortedHotels = sortedHotels.sort((a, b) => a.prices[0] - b.prices[0]); // Sort by min price
  } else if (sortOption === 'price_desc') {
    sortedHotels = sortedHotels.sort((a, b) => b.prices[1] - a.prices[1]); // Sort by max price
  }

  // Filter hotels based on search query, selected amenities, and price range
  console.log('sortedHotels', sortedHotels)
  const filteredHotels = sortedHotels.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase());
    console.log(matchesSearch)
    const hasSelectedAmenities = selectedAmenities.every((amenity) => hotel.amenities.includes(amenity));
    console.log(hasSelectedAmenities)
    const priceInRange = hotel.prices.some((price) => price >= lowPrice && price <= highPrice);
    console.log(priceInRange)
    return matchesSearch && hasSelectedAmenities && priceInRange;
  });
  console.log('filteredHotels', filteredHotels)

  return (
    <div className='h-screen'>
      {/* Navbar */}
      <NavBar props={state} />


      <div className=' z-[-6] flex flex-col'>
        <aside id="default-sidebar" className="fixed border top-[78px] left-0  w-[350px] h-fit transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
          <div className="h-full px-3 py-4 bg-gray-50">
            {/* Heading for filters */}
            <h2 className="text-l font-sans">Sort by </h2>
            <select value={sortOption} onChange={handleSortChange}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-4 items-center">
              <h2 className="text-3xl font-sans">Filters</h2>
              <button onClick={resetFilters} className="text-red-300">Clear All</button>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col border-4  p-4 mt-5">
              <h3 className='text-2xl'>Price </h3>
              <div className="flex items-center mb-2 mt-3">
                <label className="mr-2">Low Price:</label>
                <input type="number" value={lowPrice} onChange={(e) => setLowPrice(parseInt(e.target.value))} className="w-20 border rounded px-2" />
              </div>
              <div className="flex items-center">
                <label className="mr-2">High Price:</label>
                <input type="number" value={highPrice} onChange={(e) => setHighPrice(parseInt(e.target.value))} className="w-20 border rounded px-2" />
              </div>
            </div>

            {/* Amenities Filter */}
            <div id="Amenties" className="pt-2 px-10 w-100 border-4 my-2">
              <h3 className="mb-4">Amenities:</h3>
              <div className="flex flex-col">
                {am.map((amenity, index) => (
                  <div key={amenity} className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      value={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onChange={(e) => {
                        const amenityName = e.target.value;
                        if (e.target.checked) {
                          setSelectedAmenities([...selectedAmenities, amenityName]);
                        } else {
                          setSelectedAmenities(selectedAmenities.filter((amenity) => amenity !== amenityName));
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div id='Listings' className=' border top-[78px] right-0 py-2 border-r-2 px-10 overflow-scroll no-scrollbar max-h-[720px] ml-[350px] mt-[78px]'>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 gap-4 ">
              {filteredHotels.length === 0 && (
                <div className='w-full h-screen flex flex-col items-center justify-center'>
                  <p className='text-2xl text-gray-500'>No Hotels Found</p>
                  <p className='text-l text-gray-500'>Try Resetting Filters</p>
                </div>
              )}
              {filteredHotels.map((hotel) => (
                <div key={hotel.id} onClick={() => handleHotelClick(hotel.id)}>
                  <HotelCard {...hotel} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>


    </div>


  );
}

export default HotelList;







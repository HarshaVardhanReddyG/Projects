import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import ReserveCard from '../components/ReserveCard';
import RatingBar from '../components/RatingBar';
import StarIcon from '@mui/icons-material/Star';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import axiosInstance from '../helpers/axios';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

function ReviewCard(props) {
  const stars = [];
  for (let i = 0; i < props.rating; i++) {
    stars.push(<StarRoundedIcon key={i} />);
  }

  return (
    <div className="flex flex-col border border-gray-400 p-4 ">
      <h2 className="text-l font-bold">{props.name}</h2>
      <div className='text-sm text-yellow-500'>
        {stars}
      </div>
      <p>{props.review}</p>
    </div>
  );
}

function Hotelpage() {
  const { hotelId ,no_of_guests ,start_date ,end_date } = useParams();
  const [hotel ,setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [imagePopup, setImagePopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);





  useEffect(() => {
    async function fetchData() {
        try {
            console.log({ hotelId ,no_of_guests ,start_date ,end_date })
            const response = await axios.get(`http://localhost:5000/hotel/${hotelId}`,{params: {
               no_of_guests : no_of_guests,
               start_date: start_date,
               end_date: end_date
            }});
            console.log(response.data)
            setHotel(response.data);
        } catch (error) {
            console.error('Error fetching hotel data:', error);
        } finally {
          setLoading(false);
        }
    }
    fetchData();
  }, [hotelId]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleImagePopup = (index) => {
    setImagePopup(!imagePopup);
    setCurrentImageIndex(index);
    console.log(currentImageIndex);
  };

  const showNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % hotel.HotelInfo.Images.length;
    setCurrentImageIndex(nextIndex);
    console.log(currentImageIndex);
  };

  const showPreviousImage = () => {
    const previousIndex = (currentImageIndex - 1 + hotel.HotelInfo.Images.length) % hotel.HotelInfo.Images.length;
    setCurrentImageIndex(previousIndex);
    console.log(currentImageIndex);
  };

  if (loading) {
    return <Loading/>;
  }

  const a = Object.values(hotel.VacantRoomsandRR.Ratings[0]).map(num => parseInt(num));
  console.log(a)
  const rating = a.slice(0,-1)
  const totalReviews = a[a.length - 1]

  const amenitiesArray =   hotel.HotelInfo.Hotel.list_of_amenities.split(', ');




  return (
    <div className="h-screen">
      <NavBar />
      <div className='fixed  top-[78px] overflow-scroll no-scrollbar max-h-[720px] flex flex-col md:flex-row items-start  justify-between ml-10 mr-10'>
        <div className="md:w-1/2 md:mr-5">
          <h1 className="text-2xl font-bold mt-8">{hotel.HotelInfo.Hotel.Hotel_name}</h1>
          {/* <h2 className="text-lg font-semibold">Hosted by Manager</h2> */}
          <p className="text-sm">{hotel.HotelInfo.Hotel.Description}</p>

          <div className="border-t border-b border-gray-400 py-4 mt-4 ">
            <h1 className="text-xl font-bold">What this place offers</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {amenitiesArray.map(amenity => (
                <p>{amenity}</p>
              ))}
            </div>
          </div>
          <div className="text-xl bm-2 text-gray-600">
          Cancellation Policy: Can cancel booking before {hotel.HotelInfo.Hotel.cancellation_policy} hours.
        </div>
          <div >
          <h1 className="text-xl font-bold mt-2">Room Types</h1>
                  
          {hotel.HotelInfo.RoomTypes.map((roomType) => {
            const vacantRoom = hotel.VacantRoomsandRR.VacantRooms.find(room => room.room_type_id === roomType.room_type_id);            
            return (
              <div key={roomType.room_type_id} className='border-b border-gray-400 py-2 mb-2'>
                <p className="text-l font-bold">{roomType.room_type_name}</p>
                <div className='flex justify-between'>
                  <p>Default price : {roomType.default_price}</p>
                  {vacantRoom ? (
                    <div>  
                      <p>Min price: {vacantRoom.min}</p>  
                      <p>Max price: {vacantRoom.max}</p> 
                    </div>
                  ) : (
                    <p>Not vacant in the given duration</p>
                  )}
                </div>
                <p>Max Guests per room: {roomType.max_guests}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {roomType.list_of_amenties.split(', ').map(amenity => <p key={amenity}>{amenity}</p>)}
                </div>
              </div>
            );
          })
        }

          </div>
          <div className="border-b border-gray-400 py-4 mb-4">
            <RatingBar ratings = {rating} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotel.VacantRoomsandRR.Reviews.slice(0, 4).map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                rating={review.Rating}
                review={review.Review}
              />
            ))}
          </div>
          <button onClick={togglePopup} className="btn btn-primary my-4 border border-gray-400 rounded-md px-4 py-2">Show All Reviews</button>
          {showPopup && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg overflow-y-auto max-h-full relative">
                <button onClick={togglePopup} className="absolute top-0 right-0 p-2 text-black-900 hover:text-gray-900">
                  &#x2715;
                </button>
                <h1 className="text-xl font-bold mb-4">All Reviews</h1>
                <div className="grid grid-cols-1 gap-4">
                  {hotel.VacantRoomsandRR.Reviews.map((review, index) => (
                    <ReviewCard
                      key={index}
                      name={review.name}
                      rating={review.Rating}
                      review={review.Review}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="border-y border-gray-400 py-4 mb-4" >
          <h1 className="text-xl font-bold my-2">FAQS</h1>
            {hotel.HotelInfo.FAQs.map(faq =>
            <div className="mb-2">
                <p className="text-l font-bold">{faq.Q}</p>
                <p>{faq.A}</p>
            </div>
            )}
          </div>  

        </div>

        <div className="md:w-1/2 mt-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <img src={`http://localhost:5000/${hotel.HotelInfo.Images[0].image}`} onClick={() => toggleImagePopup(0)} className="w-full h-48 md:h-96" alt="Main Image" />
              {imagePopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-8 rounded-lg overflow-y-auto max-h-full relative">
                    <button onClick={() => toggleImagePopup(0)} className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800">
                      &#x2715;
                    </button>
                    <button onClick={showPreviousImage} className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-md">
                      &lt;
                    </button>
                    <button onClick={showNextImage} className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md">
                      &gt;
                    </button>
                    <img src={`http://localhost:5000/${hotel.HotelInfo.Images[currentImageIndex].image}`} alt="Popup Image" />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {hotel.HotelInfo.Images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image.image}`}
                  onClick={() => toggleImagePopup(index)}
                  className="w-full h-24 md:h-48"
                  alt={`Image ${index + 1}`}
                />
              ))}
            </div>

          </div>
          {!showPopup && !imagePopup && (
            <div className="ml-auto mt-5 md:mt-0">
              <ReserveCard RoomTypes={hotel.HotelInfo.RoomTypes} VacantRooms={hotel.VacantRoomsandRR.VacantRooms} price="10000" rout="/bill" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hotelpage;

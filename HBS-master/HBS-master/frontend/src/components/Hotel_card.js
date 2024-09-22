import React from 'react';

function HotelCard(props) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg p-4 shadow-md">
      <div className="flex-shrink-0 mr-4">
        <img src={props.imgURL} alt="Hotel" className="h-24 w-24 rounded-lg" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{props.name}</h3>
        <div className="flex items-center mt-1">
          <svg className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18m5-14l-5 9M7 9l5 9"></path>
          </svg>
          <span className="text-sm text-gray-600">{props.ratings}</span>
        </div>
        <p className="text-sm text-gray-600">{props.location}</p>
        <p className="text-sm font-semibold mt-1">{props.priceRange}</p>
      </div>
    </div>
  );
}

export default HotelCard;

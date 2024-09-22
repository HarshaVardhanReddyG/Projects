import React from 'react';

function Card(props) {
    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg">
            <img className="w-full h-56 object-cover object-center rounded-t" src={props.imgURL} alt="Card" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-xl">{props.name}</div>
                    <div className="flex items-center">
                        <div className="text-yellow-400">
                            {[...Array(props.rating)].map((_, index) => (
                                <svg key={index} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2C5.373 2 0 7.373 0 14c0 2.283.64 4.417 1.741 6.245L12 22l10.259-1.755C23.36 18.417 24 16.283 24 14c0-6.627-5.373-12-12-12zm0 20l-8.485 1.445C3.338 21.447 2 18.955 2 16c0-5.523 4.477-10 10-10s10 4.477 10 10c0 2.955-1.337 5.447-3.515 7.445L12 22zm-1.76-4.71L4.563 10.28l1.06-1.06L11 14.94l6.376-6.376 1.06 1.06-7.636 7.636z" />
                                </svg>
                            ))}
                        </div>
                        <span className="ml-2">{props.rating}/5</span>
                    </div>
                </div>
                <div className="text-gray-700 text-base mb-2">{props.location}</div>
                <div className="font-bold text-xl">{props.price}</div>
            </div>
        </div>
    );
}

export default Card;



import React, { useState } from "react";
import HotelForm from "../components/hotelForm";
import ImageForm from "../components/imageForm";
import RoomForm from "../components/roomsForm";
import Manager_NavBar from "../components/Manager_navbar";
function Manager_hotel() {


    const [currentStep, setCurrentStep] = useState(1);


    const handleNext = (e) => {
        e.preventDefault();
        setCurrentStep(currentStep + 1)
    };

    function handlePrevious() {
        setCurrentStep(currentStep - 1);
    }


    return (
        <div>
        <Manager_NavBar />    
        <div className=" mt-[78px] flex justify-center items-center">
            {currentStep === 1 && <HotelForm handleNext = {handleNext} />
            }

            {currentStep === 2 && 
                        <ImageForm handleNext={handleNext} handlePrevious={handlePrevious}/>
            } 
            {currentStep === 3 && (
                <RoomForm handlePrevious={handlePrevious}/>
                )}

        </div>
        </div>
    );
}

export default Manager_hotel;
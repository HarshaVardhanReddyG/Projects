const express = require('express');
const HotelService = require('../services/HotelService');
const auth = require("../middlewares/auth");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads', // Folder where images will be stored
  filename: function (req, file, cb) {
    const fileName = file.fieldname + '-' + Date.now() + file.originalname;
    cb(null, fileName);
  }
});


const multi_upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .jpg .jpeg .png images are supported!');
      err.name = 'ExtensionError';
      return cb(err);
    }
  },
}).array('images', 10);

const router = express.Router();


router.get('/search', async(req , res) =>{
    try{
      console.log(req.query);
      const { location, no_of_rooms, no_of_guests, start_date, end_date } = req.query;
      console.log(start_date, end_date);
      
      // Convert start_date and end_date to Date objects
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      // Offset for IST (Indian Standard Time) in minutes
      const offsetIST = 330;
      
      // Convert UTC to IST
      const startDateIST = new Date(startDate.getTime() + offsetIST * 60000);
      const endDateIST = new Date(endDate.getTime() + offsetIST * 60000);
      
      // Format as 'YYYY-MM-DD'
      const formattedStartDate = startDateIST.toISOString().split('T')[0];
      const formattedEndDate = endDateIST.toISOString().split('T')[0];
      
      const diff_ms = endDate.getTime() - startDate.getTime();
      const diff = diff_ms / (1000 * 3600 * 24) + 1;
      
      const aList = await HotelService.calculate_available_rooms(location, no_of_guests, formattedStartDate, formattedEndDate);
      const bList = await HotelService.get_booked_rooms(location, no_of_guests, formattedStartDate, formattedEndDate);
      const popList = await HotelService.get_pop_hotels(location);
      
      console.log(popList);
      
        

        const hotelList = aList.map(room => {
            const bookedRoom = bList.find(booked => booked.hotel_id === room.hotel_id && booked.date === room.date);
            const availableRoomsAfterBooking = room.no_of_avail_rooms - (bookedRoom ? bookedRoom.no_of_booked_rooms : 0);
            return {
                ...room,
                no_of_avail_rooms: availableRoomsAfterBooking
            };
        }).filter(room => room.no_of_avail_rooms > no_of_rooms);
        
        const groupedHotelList = hotelList.reduce((acc, room) => {
            if (acc[room.hotel_id]) {
                acc[room.hotel_id].count++;
            } else {
                acc[room.hotel_id] = {
                    hotel_id: room.hotel_id,
                    Hotel_name: room.Hotel_name,
                    Location: room.Location,
                    list_of_amenities: room.list_of_amenities,
                    average_rating: room.average_rating,
                    hotel_image: room.hotel_image,
                    min_price: room.min_price,
                    max_price: room.max_price,
                    count: 1
                };
            }
            return acc;
        }, {});
        
        const groupedHotelArray = Object.values(groupedHotelList).filter(hotel => hotel.count === diff);
        
        const groupedHotelListWithRes = groupedHotelArray.map(hotel => {
            const reservations = popList.find(item => item.hotel_id === hotel.hotel_id);
            return {
                ...hotel,
                reservations: reservations ? reservations.count : 0
            };
        });
        
        console.log(groupedHotelListWithRes);

        res.json({hotelList: groupedHotelListWithRes} );

    }

    catch(error){
        console.error('Error in search :', error);
        res.status(500).json({success: false, message: "Server error"});
    }

} )

router.get('/hotel/:hotel_id', async(req , res) =>{
    try{
        const hotel_id = req.params.hotel_id;  
        const {no_of_guests, start_date, end_date} = req.query 
        console.log(no_of_guests, start_date, end_date)  
      
        // Convert start_date and end_date to Date objects
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        // Offset for IST (Indian Standard Time) in minutes
        const offsetIST = 330;
        
        // Convert UTC to IST
        const startDateIST = new Date(startDate.getTime() + offsetIST * 60000);
        const endDateIST = new Date(endDate.getTime() + offsetIST * 60000);
        
        // Format as 'YYYY-MM-DD'
        const formattedStartDate = startDateIST.toISOString().split('T')[0];
        const formattedEndDate = endDateIST.toISOString().split('T')[0];

        const Hotel = await HotelService.get_hotel_info(hotel_id)
        const VacantRoomsandRR = await HotelService.get_vacant_rooms_and_rr(hotel_id, no_of_guests, formattedStartDate, formattedEndDate)
        res.json({HotelInfo: Hotel, VacantRoomsandRR: VacantRoomsandRR} );  
    }

    catch(error){
        console.error('Error in Hotel selection :', error);
        res.status(500).json({success: false, message: "Server error"});
    }

} )


router.post("/add_hotel", auth , async (req, res) => {
    try {
      const manager_id = req.user_id
      console.log(req.body)
      currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0'); 
      const register_date = `${year}-${month}-${day}`;
      const { name, location, description, address, latitude, longitude, amenities, cancellationpolicy, checkInTime, checkoutTime} = req.body
      const Hotel = await HotelService.add_hotel(manager_id, name, location, register_date, description, address, latitude, longitude, amenities, cancellationpolicy,  checkInTime, checkoutTime);  
      res.json({message: "Hotel added successfully", Hotel: Hotel})
    }
    catch (error){
      console.error("Error in adding hotel:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});





router.post("/update_hotel", auth, async (req, res) => {
    try {
      const manager_id = req.user_id
      const {name, location, description, address, latitude, longitude, amenities, cancellationpolicy, checkInTime, checkoutTime} = req.body
      const Hotel = await HotelService.edit_hotel(manager_id, name, location, description, address, latitude, longitude, amenities, cancellationpolicy,  checkInTime, checkoutTime);  
      res.json({message: "Hotel details updated successfully", Hotel: Hotel})
    }
    catch (error){
      console.error("Error in editing hotel:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/get_images", auth , async(req, res)=>{
  try{
    const manager_id = req.user_id;
    const images = await HotelService.get_image(manager_id);
    res.json({images : images});
  } catch(error){
    console.error("Error in getting images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.post("/add_images", auth, multi_upload, async (req, res) => {
  try {
    const manager_id = req.user_id;
    const imagePaths = req.files.map(file => file.filename);
    console.log(imagePaths); // Check if image paths are correctly extracted
    
    const Hotel = await HotelService.add_images(manager_id, imagePaths);  
    res.json({message: "Images added successfully", Hotel: Hotel});
  } catch (error) {
    console.error("Error in adding images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.delete("/delete_images/:image_id", auth, async (req, res) => {
  try {
    const manager_id = req.user_id;
    const { image_id } = req.params;
    const message = await HotelService.delete_images(manager_id, image_id);   
    res.json({ message: message });
  } catch (error) {
    console.error("Error in deleting images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/add_room_types", auth, async (req, res) => {
    try {
      const manager_id = req.user_id
      const {room_types} = req.body
      const { message , id } = await HotelService.add_roomTypes(manager_id, room_types);  
      res.json({message: "RoomTypes added successfully" , id: id})
    }
    catch (error){
      console.error("Error in adding RoomTypes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/delete_room_types/:room_type_id", auth, async (req, res) => {
  try {
    const manager_id = req.user_id;
    const { room_type_id } = req.params;
    const{ message , code} = await HotelService.delete_roomTypes(manager_id, room_type_id);  
    res.json({ message: message , code :code});
  } catch (error) {
    console.error("Error in deleting RoomTypes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/add_faqs", auth, async (req, res) => {
  try {
    const manager_id = req.user_id
    const {faqs} = req.body
    const id = await HotelService.add_faqs(manager_id, faqs);  
    res.json({message: "FAQs added successfully", id : id})
  }
  catch (error){
    console.error("Error in adding FAQs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/update_faqs", auth, async (req, res) => {
    try {
      const manager_id = req.user_id;
      const { faq } = req.body;
      console.log(faq)
      const message = await HotelService.update_faqs(manager_id, faq);   
      res.json({ message: message });
    } catch (error) {
      console.error("Error in updating FAQs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});



router.delete("/delete_faqs/:faq_id", auth, async (req, res) => {
    try {
      const manager_id = req.user_id;
      const { faq_id } = req.params;
      const message = await HotelService.delete_faqs(manager_id, faq_id);  
      res.json({ message: message });
    } catch (error) {
      console.error("Error in deleting FAQs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});



router.get('/hotel', auth, async(req , res) =>{
    try{
        const manager_id = req.user_id   
        const Hotel = await HotelService.get_hotel(manager_id)
        res.json({HotelDetails: Hotel} );  
    }

    catch(error){
        console.error('Error in getting Hotel details:', error);
        res.status(500).json({success: false, message: "Server error"});
    }

} )

router.get('/hotel_room_faqs', auth, async(req , res) =>{
  try{
      const manager_id = req.user_id   
      const Hotel = await HotelService.get_room_types_faqs(manager_id)
      res.json({HotelDetails: Hotel} );  
  }

  catch(error){
      console.error('Error in getting Hotel details:', error);
      res.status(500).json({success: false, message: "Server error"});
  }

} )

router.get('/pop_hotels', async(req , res) =>{
  try{   
      const Hotel = await HotelService.get_pop_hotel_all()
      res.json({Hotels: Hotel} );  
  }

  catch(error){
      console.error('Error in getting Hotel details:', error);
      res.status(500).json({success: false, message: "Server error"});
  }

} )

module.exports = router; 




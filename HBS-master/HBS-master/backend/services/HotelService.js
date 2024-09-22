const { Hotel, RoomType, Calendar, Reservation, Image, FAQ } = require("../models");
const Sequelize = require('sequelize');
const sequelize = require('../config.js');
const fs = require('fs');
const path = require('path');

class HotelService {
  static async get_booked_rooms(location, no_of_guests, startDate, endDate) {
        try {
            const bookedRooms = await sequelize.query( 
                `
                WITH date_range AS (
                    SELECT generate_series(:startDate::date, :endDate::date, INTERVAL '1 DAY') AS date
                )
                SELECT
                    to_char(dr.date, 'YYYY-MM-DD') AS date,
                    r."hotel_id",
                    SUM(r."No_of_rooms") as no_of_booked_rooms
                FROM
                    date_range dr
                JOIN
                (
                    SELECT 
                        res."hotel_id",
                        res."room_type_id",
                        res."No_of_rooms",
                        res."start_date",
                        res."end_date"
                    FROM 
                        (SELECT * FROM "Reservation" where "Reservation"."status" <> 'cancelled' AND "Reservation"."status" <> 'rejected') res
                    JOIN
                        "RoomType" rt ON res."room_type_id" = rt."room_type_id"
                    JOIN 
                        "Hotel" h ON res."hotel_id" = h."hotel_id"
                    WHERE 
                        h."Location" = :location AND rt."max_guests" >= :no_of_guests
                ) AS r ON dr.date BETWEEN r."start_date" AND r."end_date"
                GROUP BY
                    dr.date,
                    r."hotel_id"
                ORDER BY
                    dr.date, r."hotel_id"
            `,
                {
                    replacements: {
                        location: location,
                        startDate: startDate,
                        endDate: endDate,
                        no_of_guests: no_of_guests
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return bookedRooms;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async calculate_available_rooms(location, no_of_guests, startDate, endDate) {
        try {
            const availableRooms = await sequelize.query(
                `          
                SELECT
                    "Hotel"."hotel_id",
                    "Hotel_name",
                    "Location",
                    "list_of_amenities",
                    "date",
                    "average_rating",
                    SUM("no_of_avail_rooms") as no_of_avail_rooms,
                    "Image"."image" as hotel_image,
                    MIN("price") as min_price,
                    MAX("price") as max_price
                FROM
                    "Hotel"
                JOIN 
                    "hotel_average_rating_mv" ON "hotel_average_rating_mv"."hotel_id" = "Hotel"."hotel_id"
                JOIN
                    "RoomType" ON "Hotel"."hotel_id" = "RoomType"."hotel_id"
                LEFT JOIN 
                    "Calendar" ON "RoomType"."room_type_id" = "Calendar"."room_type_id"
                        AND ("Calendar"."date" BETWEEN :startDate AND :endDate)
                LEFT JOIN 
                    (SELECT DISTINCT ON ("hotel_id") "hotel_id", "image"
                    FROM "Image"
                    ORDER BY "hotel_id", RANDOM()) as "Image" ON "Hotel"."hotel_id" = "Image"."hotel_id"
                WHERE
                    "Location" = :location
                    AND "max_guests" >= :no_of_guests
                GROUP BY
                    "Hotel"."hotel_id",
                    "date",
                    "hotel_average_rating_mv"."average_rating",
                    "Image"."image";
                `,
                {
                    replacements: {
                        location: location,
                        startDate: startDate,
                        endDate: endDate,
                        no_of_guests: no_of_guests
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return availableRooms;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async get_pop_hotels(location) {
        try {
            const Reservs = await sequelize.query(
                `          
                SELECT
                    "Hotel"."hotel_id",
                    COUNT(*)
                    FROM
                    "Hotel"
                    LEFT JOIN "Reservation" ON "Reservation"."hotel_id" = "Hotel"."hotel_id"
                    WHERE
                        "Location" = :location
                    GROUP BY
                    "Hotel"."hotel_id"
            `,
                {
                    replacements: {
                        location: location
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return Reservs;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async get_pop_hotel_all() {
        try {
            const Reservs = await sequelize.query(
                `     
                SELECT
                "Hotel"."hotel_id", "Hotel"."Hotel_name", "Location", COUNT(*), "image", CAST(SUM("Rating") AS FLOAT) / COUNT("Rating") AS avg_rating
                FROM
                "Hotel"
                LEFT JOIN "Reservation" ON "Reservation"."hotel_id" = "Hotel"."hotel_id"
                JOIN "GroupRoom" ON "Reservation"."gid" = "GroupRoom"."gid"
                JOIN "Image" ON "Image"."hotel_id" = "Hotel"."hotel_id"
                GROUP BY
                "Hotel"."hotel_id",
                "image"
            `,
                {
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return Reservs;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async get_hotel_info(hotel_id) {
        try {
            const Hotel = await sequelize.query(
                `
                SELECT * FROM "Hotel" WHERE "hotel_id" = :hotel_id            
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            const RoomTypes = await sequelize.query(
                `
                SELECT "room_type_name","room_type_id", "list_of_amenties", "max_guests", "default_price" FROM "RoomType" WHERE "hotel_id" = :hotel_id            
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const Images = await sequelize.query(
                `
                SELECT "image" FROM "Image" WHERE "hotel_id" = :hotel_id            
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );


            const FAQs = await sequelize.query(
                `
                SELECT "Q","A" FROM "FAQ" WHERE "hotel_id" = :hotel_id            
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return {
                Hotel: Hotel[0],
                RoomTypes: RoomTypes,
                Images: Images,
                FAQs: FAQs
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async get_hotel(manager_id) {
        try {
            const Hotel = await sequelize.query(
                `
                SELECT * FROM "Hotel" WHERE "manager_id" = :manager_id            
                `,
                {
                    replacements: {
                        manager_id: manager_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            let hotel_id
            if (Hotel.length > 0) {
                hotel_id = Hotel[0].hotel_id;
            }
            else {
                return {
                    message: 'No hotels found for the given manager ID'
                };
            }

            const Images = await sequelize.query(
                `
                SELECT * FROM "Image" WHERE "hotel_id" = :hotel_id            
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const Ratings = await sequelize.query(
                `
                SELECT 
                    COUNT(CASE WHEN "Rating" = '1' THEN 1 END) AS count_rating_1,
                    COUNT(CASE WHEN "Rating" = '2' THEN 1 END) AS count_rating_2,
                    COUNT(CASE WHEN "Rating" = '3' THEN 1 END) AS count_rating_3,
                    COUNT(CASE WHEN "Rating" = '4' THEN 1 END) AS count_rating_4,
                    COUNT(CASE WHEN "Rating" = '5' THEN 1 END) AS count_rating_5,
                    COUNT(*) AS total_ratings
                FROM "GroupRoom"
                WHERE "hotel_id" = :hotel_id
                AND "Rating" IS NOT NULL
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            const Reviews = await sequelize.query(
                `          
                SELECT "GroupRoom"."Review",
                "GroupRoom"."Rating",
                "User"."username" as name
                FROM "GroupRoom"
                JOIN "User" ON "GroupRoom"."user_id"="User"."user_id"
                WHERE "GroupRoom"."hotel_id" = :hotel_id
                AND "GroupRoom"."Review" IS NOT NULL
                GROUP BY
                "GroupRoom"."Review",
                "GroupRoom"."Rating",
                "User"."username"
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return {
                Hotel: Hotel[0],
                Images: Images,
                Ratings: Ratings,
                Reviews: Reviews
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async get_room_types_faqs(manager_id) {
        try {
            const Hotel = await sequelize.query(
                `
                SELECT * FROM "Hotel" WHERE "manager_id" = :manager_id            
                `,
                {
                    replacements: {
                        manager_id: manager_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            let hotel_id
            if (Hotel.length > 0) {
                hotel_id = Hotel[0].hotel_id;
            }
            else {
                return {
                    message: 'No hotels found for the given manager ID'
                };
            }
            console.log(hotel_id)
            const RoomTypes = await sequelize.query(
                `
                SELECT * FROM "RoomType" WHERE "hotel_id" = :hotel_id            
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const FAQs = await sequelize.query(
                `
                SELECT "faq_id","Q","A" FROM "FAQ" WHERE "hotel_id" = :hotel_id            
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return {
                RoomTypes: RoomTypes,
                FAQs: FAQs
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async get_vacant_rooms_and_rr(hotel_id, no_of_guests, startDate, endDate) {
        try {
            console.log(startDate)
            const VacantRooms = await sequelize.query(
                `          
                WITH date_range AS (
                    SELECT generate_series(:startDate::date, :endDate::date, INTERVAL '1 DAY') AS date
                ),
                booked_rooms AS (
                    SELECT
                        to_char(dr.date, 'YYYY-MM-DD')::date AS date, 
                        r."hotel_id",
                        r."room_type_id",
                        SUM(r."No_of_rooms") as no_of_booked_rooms
                    FROM
                        date_range dr
                    JOIN
                    (
                        SELECT 
                            res."hotel_id",
                            res."room_type_id",
                            res."No_of_rooms",
                            res."start_date",
                            res."end_date"
                        FROM 
                            (SELECT * FROM "Reservation" WHERE "Reservation"."status" <> 'cancelled' AND "Reservation"."status" <> 'rejected') res
                        JOIN
                            "RoomType" rt ON res."room_type_id" = rt."room_type_id"
                        JOIN 
                            "Hotel" h ON res."hotel_id" = h."hotel_id"
                        WHERE 
                            h."hotel_id" = :hotel_id AND rt."max_guests" >= :no_of_guests
                    ) AS r ON dr.date BETWEEN r."start_date" AND r."end_date"
                    GROUP BY
                        dr.date,
                        r."hotel_id",
                        r."room_type_id"
                ),
                available_rooms AS (
                    SELECT
                        "Hotel"."hotel_id",
                        "RoomType"."room_type_id",
                        "Calendar"."date",
                        "no_of_avail_rooms",
                        MIN("price") as min_price,
                        MAX("price") as max_price
                    FROM
                        "Hotel"
                    JOIN
                        "RoomType" ON "Hotel"."hotel_id" = "RoomType"."hotel_id"
                    LEFT JOIN 
                        "Calendar" ON "RoomType"."room_type_id" = "Calendar"."room_type_id"
                            AND ("Calendar"."date" BETWEEN :startDate::date AND :endDate::date)
                    WHERE
                        "Hotel"."hotel_id" = :hotel_id
                        AND "max_guests" >= :no_of_guests
                    GROUP BY
                        "Hotel"."hotel_id",
                        "date",
                        "RoomType"."room_type_id",
                        "no_of_avail_rooms"
                )
                SELECT
                    ar."hotel_id",
                    ar."room_type_id",
                    MIN(ar."no_of_avail_rooms" - COALESCE(br."no_of_booked_rooms", 0)) AS min_vacant_rooms,
                    MIN(ar.min_price),
                    MAX(ar.max_price)
                FROM
                    available_rooms ar
                LEFT JOIN
                    booked_rooms br ON ar."date" = br."date" AND ar."hotel_id" = br."hotel_id" AND ar."room_type_id" = br."room_type_id"
                GROUP BY
                    ar."hotel_id",
                    ar."room_type_id";   
                `,
                {
                    replacements: {
                        hotel_id: hotel_id,
                        no_of_guests: no_of_guests,
                        startDate: startDate,
                        endDate: endDate
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            const Ratings = await sequelize.query(
                `
                SELECT 
                    COUNT(CASE WHEN "Rating" = '1' THEN 1 END) AS count_rating_1,
                    COUNT(CASE WHEN "Rating" = '2' THEN 1 END) AS count_rating_2,
                    COUNT(CASE WHEN "Rating" = '3' THEN 1 END) AS count_rating_3,
                    COUNT(CASE WHEN "Rating" = '4' THEN 1 END) AS count_rating_4,
                    COUNT(CASE WHEN "Rating" = '5' THEN 1 END) AS count_rating_5,
                    COUNT(*) AS total_ratings
                FROM "GroupRoom"
                WHERE "hotel_id" = :hotel_id
                AND "Rating" IS NOT NULL
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            const Reviews = await sequelize.query(
                `          
                SELECT "GroupRoom"."Review",
                "GroupRoom"."Rating",
                "User"."username" as name
                FROM "GroupRoom"
                JOIN "User" ON "GroupRoom"."user_id"="User"."user_id"
                WHERE "GroupRoom"."hotel_id" = :hotel_id
                AND "GroupRoom"."Review" IS NOT NULL
                GROUP BY
                "GroupRoom"."Review",
                "GroupRoom"."Rating",
                "User"."username"
                `,
                {
                    replacements: {
                        hotel_id: hotel_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            return {
                VacantRooms: VacantRooms,
                Ratings: Ratings,
                Reviews: Reviews
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async add_hotel(manager_id, Hotel_name, Location, register_date, Description, Address, latitude, longitude, list_of_amenities, cancellation_policy, check_in, check_out ) {
        try {
            const check_hotel = await Hotel.findAll({ where: { manager_id } });
            if (check_hotel.length > 0) {
                return 'Manager already has a hotel';
            }
            console.log({
                manager_id: manager_id,
                Hotel_name: Hotel_name,
                Location: Location,
                register_date: register_date,
                Description: Description,
                Address: Address,
                latitude: latitude,
                longitude: longitude,
                list_of_amenities: list_of_amenities.join(","),
                cancellation_policy: cancellation_policy,
                check_in: check_in,
                check_out: check_out
            })
            const MyHotel = await Hotel.create({
                manager_id: manager_id,
                Hotel_name: Hotel_name,
                Location: Location,
                register_date: register_date,
                Description: Description,
                Address: Address,
                latitude: latitude,
                longitude: longitude,
                list_of_amenities: list_of_amenities.join(","),
                cancellation_policy: cancellation_policy,
                check_in: check_in,
                check_out: check_out
            });  
            const hotelId = MyHotel.hotel_id;
            return {
                MyHotel
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    } 



    static async add_roomTypes(manager_id, RoomTypes) {
        try {
            const check_hotel = await Hotel.findAll({ where: { manager_id } });
            const hotelId = check_hotel[0].hotel_id;
            console.log('hotedl_id', hotelId)
    
            const calendars = [];
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 90);
            let room_type_id;
            for (let room_type of RoomTypes) {
                const createdRoomType = await RoomType.create({
                    room_type_name: room_type.name,
                    no_of_rooms: room_type.no_of_rooms,
                    list_of_amenties: room_type.list_of_amenties,
                    max_guests: room_type.max_guests,
                    default_price: room_type.default_price,
                    hotel_id: hotelId
                });

                
    
                const roomTypeId = createdRoomType.room_type_id;
                room_type_id = roomTypeId
                console.log(createdRoomType)


    
                let currentDateIterator = new Date(currentDate);
                while (currentDateIterator <= endDate) {
                    const date = new Date(currentDateIterator);
                    const availableRooms = room_type.no_of_rooms;
    
                    const calendar = {
                        room_type_id: roomTypeId,
                        date: date,
                        price: room_type.default_price,
                        no_of_avail_rooms: availableRooms
                    };
                    calendars.push(calendar);
                    currentDateIterator.setDate(currentDateIterator.getDate() + 1);
                }
            }
    
            await Calendar.bulkCreate(calendars);
            return  { message: "Added successfully", id: room_type_id } ;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    

    static async edit_hotel(manager_id, Hotel_name, Location, Description, Address, latitude, longitude, list_of_amenities, cancellation_policy, check_in, check_out) {
        try {
            const [affectedRows] = await Hotel.update({
                Hotel_name: Hotel_name,
                Location: Location,
                Description: Description,
                Address: Address,
                latitude: latitude,
                longitude: longitude,
                list_of_amenities: list_of_amenities.join(","),
                cancellation_policy: cancellation_policy,
                check_in: check_in,
                check_out: check_out
            }, {
                where: { manager_id: manager_id }
            });
            
            if (affectedRows === 0) {
                return 'Hotel not found for the provided manager_id';
            }
            
            const updatedHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            return {
                updatedHotel
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }


    static async get_image(manager_id){
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            const hotelId = MyHotel.hotel_id;
            
            const images = await Image.findAll({ where: { hotel_id: hotelId } });
            return images
        }
        catch (error) {
            throw new Error(error.message);
        }
    } 

    static async add_images(manager_id, images) {
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            const hotelId = MyHotel.hotel_id;
            
            for (let image of images){
                await Image.create({
                    image: image,
                    hotel_id: hotelId
                }); 
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    static async add_faqs(manager_id, FAQs) {
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            const hotelId = MyHotel.hotel_id;
            let id;
            console.log(faq)
            for (let faq of FAQs){
                const faq_in = await FAQ.create({
                    Q: faq.Q,
                    A: faq.A,
                    hotel_id: hotelId
                }); 
                id = faq_in.faq_id
            }

            return id
        }
        catch (error) {
            throw new Error(error.message);
        }
    }



static async delete_images(manager_id, image_id) {
    try {
        const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
        if (!MyHotel) {
            return "Hotel not found for the provided manager_id";
        }
        const hotelId = MyHotel.hotel_id;

        // Find the images to delete
        const imagesToDelete = await Image.findAll({ where: { image_id: image_id, hotel_id: hotelId } });

        // Delete images from database
        await Image.destroy({ where: { image_id: image_id, hotel_id: hotelId } });

        // Delete image files from uploads directory
        imagesToDelete.forEach(image => {
            const imagePath = path.join(__dirname, '../uploads', image.image); // Adjust the path as necessary
            fs.unlinkSync(imagePath);
        });

        return {
            message: "Images deleted successfully"
        };
    } catch (error) {
        throw new Error(error.message);
    }
}
    static async delete_faqs(manager_id, faq_id) {
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            const hotelId = MyHotel.hotel_id;
    
            await FAQ.destroy({ where: { faq_id: faq_id, hotel_id: hotelId } });
            
    
            let message = "FAQ deleted succesfully"
            return {
                message
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    static async delete_roomTypes(manager_id, room_type_id) {
        try {
            let message
            let code
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            const hotelId = MyHotel.hotel_id;
            
            const bookedRooms = await sequelize.query( 
                `
                SELECT COUNT(*)
                FROM "Reservation"
                WHERE "room_type_id" = :room_type_id 
                AND "Reservation"."status" <> 'cancelled' 
                AND "Reservation"."status" <> 'rejected' 
                AND "hotel_id" = :hotel_id 
                AND "start_date" > :today_date
                `,
                {
                    replacements: {
                        room_type_id: room_type_id,
                        hotel_id: hotelId,
                        today_date: new Date()
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            console.log("Booked Rooms",bookedRooms)
            if(bookedRooms[0].count !== '0'){
                message = "RoomType has upcoming reservations, deletion not possible"
                code = 0
            }
            else{
                await RoomType.destroy({ where: { room_type_id: room_type_id, hotel_id: hotelId } });
                message = "RoomType deleted successfully"
                code = 1
            }
            return {
                message , code
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }   
    static async update_images(manager_id, img) {
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            const hotelId = MyHotel.hotel_id;
    

            await Image.update(
                { image: img.image },
                { where: { image_id: img.image_id, hotel_id: hotelId } }
            );

    
            let message = "Image updated succesfully"
            return {
                message
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    static async update_faqs(manager_id, faq) {
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            const hotelId = MyHotel.hotel_id;
    
            await FAQ.update(
                { 
                    Q: faq.Q,
                    A: faq.A
                },
                { where: { faq_id: faq.faq_id, hotel_id: hotelId } }
            );

    
            let message = "FAQ updated succesfully"
            return {
                message
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
            
}

module.exports = HotelService;

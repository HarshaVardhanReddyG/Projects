const { Hotel, RoomType, Calendar, Reservation, GroupRoom } = require("../models");
const Sequelize = require('sequelize');
const sequelize = require('../config.js');

class ReservationService {
    static async validate_reservation(hotel_id, no_of_guests, startDate, endDate) {
        try {
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
                        r."room_type_name",
                        SUM(r."No_of_rooms") as no_of_booked_rooms
                    FROM
                        date_range dr
                    JOIN
                    (
                        SELECT 
                            res."hotel_id",
                            res."room_type_id",
                            rt."room_type_name",
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
                        r."room_type_id",
                        r."room_type_name"
                ),
                available_rooms AS (
                    SELECT
                        "Hotel"."hotel_id",
                        "RoomType"."room_type_id",
                        "RoomType"."room_type_name",
                        "Calendar"."date",
                        "no_of_avail_rooms",
                        "price"
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
                        "RoomType"."room_type_name",
                        "no_of_avail_rooms",
                        "price"
                )
                SELECT
                    ar."hotel_id",
                    ar."room_type_id",
                    ar."room_type_name",
                    MIN(ar."no_of_avail_rooms" - COALESCE(br."no_of_booked_rooms", 0)) AS min_vacant_rooms,
                    SUM(ar."price") as total_room_price
                FROM
                    available_rooms ar
                LEFT JOIN
                    booked_rooms br ON ar."date" = br."date" AND ar."hotel_id" = br."hotel_id" AND ar."room_type_id" = br."room_type_id"
                GROUP BY
                    ar."hotel_id",
                    ar."room_type_id",
                    ar."room_type_name";   
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
            return {
                VacantRooms: VacantRooms
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async reserve(user_id, hotel_id, room_types, start_date, end_date, totalPrice) {
        try {
            const groupRoom = await GroupRoom.create({
                user_id: user_id,
                hotel_id: hotel_id
            });

            const gid = groupRoom.gid;
            for (const roomType of room_types) {
                const { room_type_id, count } = roomType;
                await Reservation.create({
                    booked_date: new Date(),
                    start_date: start_date,
                    end_date: end_date,
                    gid: gid,
                    hotel_id: hotel_id,
                    room_type_id: room_type_id,
                    No_of_rooms: count,
                    payment: totalPrice[room_type_id].total_price,
                    status: 'temporary'
                });
            }

            return { gid };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async confirm_reservation(gid, status, user_id) {
        try {
            let message;
            const check_user = await GroupRoom.findOne({
                where: { gid: parseInt(gid), user_id: parseInt(user_id) }
            });

            if (!check_user) {
                message = "User not found";
            }
            else if (status === 'cancelled') {
                await Reservation.destroy({ where: { gid: gid } });
                await GroupRoom.destroy({ where: { gid: gid, user_id: user_id } })
                message = "Reservation cancelled successfully";
            }
            else if (status === 'confirmed') {
                await Reservation.update(
                    { status: 'pending' },
                    { where: { gid: gid } }
                );
                message = "Reservation confirmed successfully";
            }
            else {
                throw new Error("Invalid status provided");
            }
            return { message };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    static async get_bill(user_id , gid){
            try {
                const Reservations = await sequelize.query(
                    `          
                    SELECT
                    "Reservation"."rid",
                    "Reservation"."booked_date",
                    "Reservation"."start_date",
                    "Reservation"."end_date",
                    "Reservation"."gid",
                    "Reservation"."hotel_id",
                    "Reservation"."room_type_id",
                    "Reservation"."No_of_rooms",
                    "Reservation"."payment",
                    "Reservation"."status",
                    GU."Review",
                    GU."Rating",
                    GU."username",
                    GU."phone_number",
                    GU."country_code",
                    GU."email",
                    "HotelImage"."Hotel_name",
                    "HotelImage"."Address",
                    "HotelImage"."latitude",
                    "HotelImage"."longitude",
                    "HotelImage"."cancellation_policy",
                    "HotelImage"."check_in",
                    "HotelImage"."check_out",
                    "HotelImage"."image",
                    "RoomType"."room_type_name"
                FROM
                    "Reservation"
                JOIN
                    "RoomType" ON "RoomType"."room_type_id" = "Reservation"."room_type_id"
                LEFT JOIN
                    (
                        "GroupRoom" 
                        JOIN
                        "User" ON "User"."user_id" = "GroupRoom"."user_id"
                    ) AS GU
                ON "Reservation"."gid" = GU."gid" 
                JOIN
                    (
                        SELECT
                            "Hotel".*,
                            "Image"."image",
                            ROW_NUMBER() OVER (PARTITION BY "Hotel"."hotel_id" ORDER BY "Image"."image_id") AS rn
                        FROM
                            "Hotel"
                        LEFT JOIN
                            "Image" ON "Image"."hotel_id" = "Hotel"."hotel_id"
                    ) AS "HotelImage" ON "HotelImage"."hotel_id" = "Reservation"."hotel_id" AND "HotelImage".rn = 1
                WHERE
                    "Reservation"."gid" = :gid
                    `,
                    {
                        replacements: {
                            gid: gid
                        },
                        type: Sequelize.QueryTypes.SELECT
                    }
                );
    
    
                const groupedReservations = [];
                let currentGid = null;
                let currentGroup = null;
    
                for (const reservation of Reservations) {
                    if (reservation.gid !== currentGid) {
                        currentGid = reservation.gid;
                        currentGroup = [];
                        groupedReservations.push(currentGroup);
                    }
                    currentGroup.push(reservation);
                }
    
                return groupedReservations;
            }
            catch (error) {
                throw new Error(error.message);
            }
        
    }

    static async get_user_reservations(user_id) {
        try {
            const Reservations = await sequelize.query(
                `          
                                    SELECT
                        "Reservation"."rid",
                        "Reservation"."booked_date",
                        "Reservation"."start_date",
                        "Reservation"."end_date",
                        "Reservation"."gid",
                        "Reservation"."hotel_id",
                        "Reservation"."room_type_id",
                        "Reservation"."No_of_rooms",
                        "Reservation"."payment",
                        "Reservation"."status",
                        "GroupRoom"."Review",
                        "GroupRoom"."Rating",
                        "HotelImage"."Hotel_name",
                        "HotelImage"."Address",
                        "HotelImage"."latitude",
                        "HotelImage"."longitude",
                        "HotelImage"."cancellation_policy",
                        "HotelImage"."check_in",
                        "HotelImage"."check_out",
                        "HotelImage"."image",
                        "RoomType"."room_type_name"
                        FROM
                        "Reservation"
                        JOIN
                        "RoomType" ON "RoomType"."room_type_id" = "Reservation"."room_type_id"
                        LEFT JOIN
                        "GroupRoom" ON "Reservation"."gid" = "GroupRoom"."gid"
                        JOIN
                        (
                            SELECT
                                "Hotel".*,
                                "Image"."image",
                                ROW_NUMBER() OVER (PARTITION BY "Hotel"."hotel_id" ORDER BY "Image"."image_id") AS rn
                            FROM
                                "Hotel"
                            LEFT JOIN
                                "Image" ON "Image"."hotel_id" = "Hotel"."hotel_id"
                        ) AS "HotelImage" ON "HotelImage"."hotel_id" = "Reservation"."hotel_id" AND "HotelImage".rn = 1
                        WHERE
                        "user_id"= :user_id
                `,
                {
                    replacements: {
                        user_id: user_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );


            const groupedReservations = [];
            let currentGid = null;
            let currentGroup = null;

            for (const reservation of Reservations) {
                if (reservation.gid !== currentGid) {
                    currentGid = reservation.gid;
                    currentGroup = [];
                    groupedReservations.push(currentGroup);
                }
                currentGroup.push(reservation);
            }

            return groupedReservations;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    static async cancel_reservation(gid, user_id) {
        try {
            const check_user = await GroupRoom.findOne({
                where: { gid: parseInt(gid), user_id: parseInt(user_id) }
            });

            if (!check_user) {
                return { message: "User not found" };
            }

            await Reservation.update(
                { status: 'cancelled' },
                { where: { gid: parseInt(gid) } }
            );

            return "Reservation cancelled successfully";
        } catch (error) {
            throw new Error("Error in cancelling reservation: " + error.message);
        }
    }
    static async confirm_reject_reservation(gid, status, manager_id) {
        try {
            let message;
            const groupRoom = await GroupRoom.findOne({
                where: { gid }
            });
            const get_hotel = groupRoom.hotel_id;
            const check_manager = await Hotel.findOne({
                where: { hotel_id: get_hotel, manager_id }
            });
            console.log(get_hotel)
            console.log(check_manager)
            if (!check_manager) {
                return "User is not authorized to manage this hotel";
            }
            console.log("status is ", status)
            if (status === 'rejected') {
                await Reservation.update(
                    { status: 'rejected' },
                    { where: { gid: gid } }
                );
                message = "Reservation rejected successfully";
            }
            else if (status === 'accepted') {
                await Reservation.update(
                    { status: 'accepted' },
                    { where: { gid: gid } }
                );
                message = "Reservation confirmed successfully";
            }
            else {
                message = "Invalid status provided";
            }

            return { message };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    static async get_manager_reservations(user_id) {
        try {
            const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

            const Reservations = await sequelize.query(
                `SELECT
                    rid, booked_date, start_date, end_date, "GroupRoom"."gid", status, phone_number, payment, room_type_name, "No_of_rooms"
                FROM
                    "Reservation"
                JOIN (SELECT * FROM (SELECT "room_type_id", "room_type_name" FROM "RoomType")) r ON r."room_type_id" = "Reservation"."room_type_id"
                LEFT JOIN "GroupRoom" ON "Reservation"."gid" = "GroupRoom"."gid"
                JOIN "Hotel" ON "Hotel"."hotel_id" = "Reservation"."hotel_id"
                JOIN (SELECT * FROM (SELECT "user_id", "phone_number" FROM "User")) h ON h."user_id" = "GroupRoom"."user_id"
                WHERE
                    "manager_id" = :manager_id
                `,
                {
                    replacements: {
                        manager_id: user_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const groupedReservations = groupByGid(Reservations);

            const TodayReservations = await sequelize.query(
                `SELECT
                    *
                 FROM
                    "Reservation"
                 LEFT JOIN "GroupRoom" ON "Reservation"."gid" = "GroupRoom"."gid"
                 JOIN "Hotel" ON "Hotel"."hotel_id" = "Reservation"."hotel_id"
                 WHERE
                    "manager_id" = :manager_id
                    AND :today_date BETWEEN "start_date" AND "end_date"
                `,
                {
                    replacements: {
                        manager_id: user_id,
                        today_date: today
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const groupedTodayReservations = groupByGid(TodayReservations);

            return {
                Reservations: groupedReservations,
                TodayReservations: groupedTodayReservations
            };
        } catch (error) {
             Error(error.message);
        }
    }
    static async check_cancellation_policy(gid) {
        try {
            const cancellation_policyData = await sequelize.query(
                `
                SELECT cancellation_policy, start_date, check_in
                FROM "GroupRoom"
                JOIN "Hotel" ON "GroupRoom"."hotel_id" = "Hotel"."hotel_id"
                LEFT JOIN "Reservation" ON "Reservation"."gid" = "GroupRoom"."gid"
                WHERE "GroupRoom"."gid" = :gid
                GROUP BY "GroupRoom"."gid", cancellation_policy, start_date, check_in
                `,
                {
                    replacements: {
                        gid: gid
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            const { start_date, check_in, cancellation_policy } = cancellation_policyData[0];

            const combinedDateTime = new Date(`${start_date}T${check_in}`);
            console.log("Date Time", combinedDateTime)
            const now = new Date();

            const timeDifference = combinedDateTime.getTime() - now.getTime();
            const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

            let a = 0;

            if (timeDifferenceInHours > cancellation_policy) {
                a = 1;
            }

            console.log(a);
            return a;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async get_calendar(manager_id) {
        try {
            const calendarData = await sequelize.query(
                `
                SELECT date, price, "RoomType"."room_type_id", room_type_name, no_of_avail_rooms
                FROM "Calendar"
                JOIN "RoomType" ON "Calendar"."room_type_id" = "RoomType"."room_type_id"
                JOIN "Hotel" ON "Hotel"."hotel_id" = "RoomType"."hotel_id"
                WHERE "manager_id" = :manager_id
                `,
                {
                    replacements: {
                        manager_id: manager_id
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
        
            const calendarByRoomType = {};
            calendarData.forEach(entry => {
                const roomTypeId = entry.room_type_id;
                if (!calendarByRoomType[roomTypeId]) {
                    calendarByRoomType[roomTypeId] = [];
                }
                calendarByRoomType[roomTypeId].push({
                    date: entry.date,
                    price: entry.price,
                    room_type_name: entry.room_type_name,
                    no_of_avail_rooms: entry.no_of_avail_rooms
                });
            });
        
            return {
                calendar: calendarByRoomType
            };
        } catch (error) {
            throw new Error(error.message);
        }
    
    }  

    static async update_rr(gid, user_id, rating, review){
        try {
            const UpdatedRating = await GroupRoom.update(
                { Rating: rating, Review: review },
                { where: { gid: gid, user_id: user_id } }
            );
            return UpdatedRating.length
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async change_price(manager_id, DateList) {
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            if (!MyHotel) {
                return "Hotel not found for the provided manager_id";
            }
            const hotelId = MyHotel.hotel_id;
    
            for (let date_price of DateList) {
                const MyRoom = await RoomType.findOne({ where: { room_type_id: date_price.room_type_id } });
                if (!MyRoom) {
                    return "Room type not found for the provided room_type_id";
                }
    
                if (MyRoom.hotel_id !== hotelId) {
                    return "User doesn't have permission to modify this room type";
                }
    
                await Calendar.update(
                    { price: date_price.price },
                    { where: { room_type_id: date_price.room_type_id, date: date_price.date } }
                );
            }
    
            return {
                message: "Price changed successfully"
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async block_rooms(manager_id, DateList) {
        try {
            const MyHotel = await Hotel.findOne({ where: { manager_id: manager_id } });
            if (!MyHotel) {
                return "Hotel not found for the provided manager_id";
            }
            const hotelId = MyHotel.hotel_id;
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 90);

            const bookedRooms = await sequelize.query( 
                `
                WITH date_range AS (
                    SELECT generate_series(:startDate::date, :endDate::date, INTERVAL '1 DAY') AS date
                )
                SELECT
                    to_char(dr.date, 'YYYY-MM-DD') AS date,
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
                    (
                        SELECT * FROM "Reservation" 
                        WHERE "Reservation"."status" <> 'cancelled' 
                        AND "Reservation"."status" <> 'rejected'
                    ) res
                    JOIN
                        "RoomType" rt ON res."room_type_id" = rt."room_type_id"
                    JOIN 
                        "Hotel" h ON res."hotel_id" = h."hotel_id"
                    WHERE 
                        h."hotel_id" = :hotel_id
                ) AS r ON dr.date BETWEEN r."start_date" AND r."end_date"
                GROUP BY
                    dr.date,
                    r."room_type_id"
                ORDER BY
                    dr.date
                `,
                {
                    replacements: {
                        hotel_id: hotelId,
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0]
                    },
                    type: Sequelize.QueryTypes.SELECT
                }
            );
    
            for (let date_price of DateList) {
                const MyRoom = await RoomType.findOne({ where: { room_type_id: date_price.room_type_id } });
                if (!MyRoom) {
                    return "Room type not found for the provided room_type_id";
                }
    
                if (MyRoom.hotel_id !== hotelId) {
                    return "User doesn't have permission to modify this room type";
                }
                
                const bookedRoom = bookedRooms.find(room => room.room_type_id === date_price.room_type_id && room.date === date_price.date);

                if (bookedRoom && date_price.no_of_avail_rooms < bookedRoom.no_of_booked_rooms) {
                    return {
                        message: "Number of available rooms are less than number of booked rooms"
                    };
                }

                await Calendar.update(
                    { no_of_avail_rooms: date_price.no_of_avail_rooms },
                    { where: { room_type_id: date_price.room_type_id, date: date_price.date } }
                );
            }
    
            return {
                message: "Price changed successfully"
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updateCalendar() {
        try {
            const currentDate = new Date();
            const currentDateStr = currentDate.toISOString().split('T')[0];
        
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 90);
            const endDateStr = endDate.toISOString().split('T')[0];
        
            await Calendar.destroy({
                where: {
                    date: { $lt: currentDateStr }
                }
            });
        
            const roomTypes = await RoomType.findAll();
        
            for (const roomType of roomTypes) {
                let dateIterator = new Date(currentDate);
                while (dateIterator <= endDate) {
                    const dateStr = dateIterator.toISOString().split('T')[0];
        
                    const existingEntry = await Calendar.findOne({
                        where: {
                            room_type_id: roomType.room_type_id,
                            date: dateStr
                        }
                    });
        
                    if (!existingEntry) {
                        await Calendar.create({
                            room_type_id: roomType.room_type_id,
                            date: dateStr,
                            price: roomType.default_price,
                            no_of_avail_rooms: roomType.no_of_rooms
                        });
                    }
                    dateIterator.setDate(dateIterator.getDate() + 1);
                }
            }
            
            return {
                message: "Calendar Updated successfully"
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }  
    
    static async get_reservations(manager_id){
        try{
        const today = new Date().toISOString().split('T')[0];
        const TodayReservations = await sequelize.query(
            `SELECT
            "username", "phone_number", "email", "start_date", "end_date"
            FROM
            "Reservation"
            LEFT JOIN "GroupRoom" ON "Reservation"."gid" = "GroupRoom"."gid"
            JOIN "Hotel" ON "Hotel"."hotel_id" = "Reservation"."hotel_id"
            JOIN "User" ON "User"."user_id" = "GroupRoom"."user_id"
            WHERE
               "manager_id" = :manager_id
               AND :today_date BETWEEN "start_date" AND "end_date"
            GROUP BY
               "GroupRoom"."gid",
               "username",
               "phone_number",
               "email",
               "start_date",
               "end_date"
            `,
            {
                replacements: {
                    manager_id: manager_id,
                    today_date: today
                },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        return {
            TodayReservations
        };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}    

function groupByGid(reservations) {
    const groupedReservations = [];
    let currentGid = null;
    let currentGroup = null;

    for (const reservation of reservations) {
        if (reservation.gid !== currentGid) {
            currentGid = reservation.gid;
            currentGroup = [];
            groupedReservations.push(currentGroup);
        }
        currentGroup.push(reservation);
    }

    return groupedReservations;
}

module.exports = ReservationService;

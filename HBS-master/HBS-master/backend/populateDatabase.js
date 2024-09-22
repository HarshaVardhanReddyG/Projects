const faker = require('faker');
const bcrypt = require('bcrypt');
const { User, Hotel, Reservation, RoomType, FAQ, Calendar, Image, GroupRoom } = require('./models');

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomLocation() {
  const locations = ['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai', 'Vizag'];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function getRandomUserIdForGuest() {
  const users = await User.findAll({ 
    attributes: ['user_id'], 
    where: { usertype: 'guest' } 
  });
  const userIds = users.map(user => user.user_id);
  return getRandomFromArray(userIds);
}

async function getRandomUserIdForManager() {
  const users = await User.findAll({ 
    attributes: ['user_id'], 
    where: { usertype: 'HM' } 
  });
  const userIds = users.map(user => user.user_id);
  return getRandomFromArray(userIds);
}

async function getRandomHotelId() {
  const hotels = await Hotel.findAll({ attributes: ['hotel_id'] });
  const hotelIds = hotels.map(hotel => hotel.hotel_id);
  return getRandomFromArray(hotelIds);
}

async function generateHashedPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword;
}

async function generateUsers() {
  const users = [];
  const totalGuests = 200;
  const totalHMs = 60;
  
  for (let i = 0; i < totalHMs; i++) {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: await generateHashedPassword('123'),
      phone_number: faker.phone.phoneNumber().replace(/\D/g, ''),
      country_code: Math.floor(Math.random() * 999) + 1,
      usertype: 'HM'
    };
    users.push(user);
  }
  
  for (let i = 0; i < totalGuests; i++) {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: await generateHashedPassword('123'),
      phone_number: faker.phone.phoneNumber().replace(/\D/g, ''),
      country_code: Math.floor(Math.random() * 999) + 1,
      usertype: 'guest'
    };
    users.push(user);
  }
  
  await User.bulkCreate(users);
}

const hotelAmenities = [
  'Wifi', 'TV', 'Kitchen', 'Washing machine', 'Free parking on premises',
  'Paid parking on premises', 'Air conditioning', 'Dedicated workspace', 'Pool',
  'Hot tub', 'Patio', 'BBQ grill', 'Outdoor dining area', 'Firepit',
  'Pool table', 'Indoor fireplace', 'Piano', 'Exercise Equipment',
  'Lake access', 'Beach access', 'Ski-in/out', 'Outdoor shower',
  'Smoke alarm', 'First aid kit', 'Fire extinguisher', 'Carbon monoxide alarm'
];

const roomAmenities = [
  'Wifi', 'TV', 'Kitchen', 'Washing machine', 'Free parking on premises',
  'Paid parking on premises', 'Air conditioning', 'Dedicated workspace', 'Pool',
  'Hot tub', 'Patio', 'BBQ grill', 'Outdoor dining area', 'Firepit',
  'Pool table', 'Indoor fireplace', 'Piano', 'Exercise Equipment',
  'Lake access', 'Beach access', 'Ski-in/out', 'Outdoor shower',
  'Smoke alarm', 'First aid kit', 'Fire extinguisher', 'Carbon monoxide alarm'
];

function getRandomAmenities(amenities, probability) {
  return amenities.filter(() => Math.random() < probability);
}

async function generateHotels() {
  const hotels = [];
  for (let i = 0; i < 50; i++) {
    const managerUserId = await getRandomUserIdForManager();
    const selectedHotelAmenities = getRandomAmenities(hotelAmenities, 0.3);
    const hotel = {
      manager_id: managerUserId,
      Hotel_name: faker.company.companyName(),
      Location: randomLocation(),
      register_date: faker.date.past(),
      Description: faker.lorem.paragraph(),
      Address: faker.address.streetAddress(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      list_of_amenities: selectedHotelAmenities.join(', '),
      cancellation_policy: faker.random.number({ min: 1, max: 100 }),
      check_in: faker.random.arrayElement(['12:00', '14:00', '15:00']),
      check_out: faker.random.arrayElement(['10:00', '11:00', '12:00'])
    };
    hotels.push(hotel);
  }
  await Hotel.bulkCreate(hotels);
}

async function generateImages() {
  const images = [];
  const hotelImages = ['hotel1.jpg', 'hotel2.jpg', 'hotel3.jpg', 'hotel4.jpg', 'hotel5.jpg'];

  const hotels = await Hotel.findAll();

  for (let hotel of hotels) {
    const numImages = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numImages; i++) {
      const randomIndex = Math.floor(Math.random() * hotelImages.length);
      const selectedImage = hotelImages[randomIndex];

      const image = {
        image: selectedImage,
        hotel_id: hotel.hotel_id
      };
      images.push(image);
    }
  }

  await Image.bulkCreate(images);
}

async function generateRoomTypes() {
  const roomTypes = [];
  const hotels = await Hotel.findAll();
  for (let hotel of hotels) {
    for (let i = 0; i < 3; i++) {
      const selectedRoomAmenities = getRandomAmenities(roomAmenities, 0.3);
      const roomType = {
        room_type_name: faker.lorem.word(),
        no_of_rooms: Math.floor(Math.random() * 10) + 1,
        list_of_amenties: selectedRoomAmenities.join(', '),
        max_guests: Math.floor(Math.random() * 4) + 1,
        hotel_id: hotel.hotel_id,
        default_price: 2000
      };
      roomTypes.push(roomType);
    }
  }
  await RoomType.bulkCreate(roomTypes);
}

async function generateGroupRoom() {
  const groupRooms = [];
  const hotels = await Hotel.findAll();
  
  for (let hotel of hotels) {
    const roomTypes = await RoomType.findAll({ where: { hotel_id: hotel.hotel_id } });
    const numGroup = roomTypes.length;
    
    for (let i = 0; i < numGroup; i++) {
      const groupRoom = {
        user_id: await getRandomUserIdForGuest(),
        hotel_id: hotel.hotel_id,
        Review: faker.lorem.paragraph(),
        Rating: faker.random.number({ min: 1, max: 5 })
      };
      
      groupRooms.push(groupRoom);
    }
  }
  
  await GroupRoom.bulkCreate(groupRooms);
}


async function generateReservations() {
  const currentDate = new Date();
  const reservationEndDate = new Date();
  reservationEndDate.setDate(currentDate.getDate() + 30);

  const groupRooms = await GroupRoom.findAll();
  const reservations = [];

  for (let groupRoom of groupRooms) {
    const roomTypes = await RoomType.findAll({ where: { hotel_id: groupRoom.hotel_id } });
    const bookedDate = faker.date.between(currentDate, reservationEndDate);
    const startDate = faker.date.between(bookedDate, reservationEndDate);
    const endDate = faker.date.between(startDate, reservationEndDate);
    const status = faker.random.arrayElement(['cancelled', 'accepted', 'rejected', 'pending'])

    for (let roomType of roomTypes) {
      const availableRooms = roomType.no_of_rooms;
      const numRooms = Math.floor(Math.random() * availableRooms) + 1;

      const reservation = {
        booked_date: bookedDate,
        start_date: startDate,
        end_date: endDate,
        user_id: groupRoom.user_id,
        hotel_id: groupRoom.hotel_id,
        room_type_id: roomType.room_type_id,
        No_of_rooms: numRooms,
        payment: faker.random.number(),
        status: status,
        gid: groupRoom.gid
      };
      
      reservations.push(reservation);
    }
  }
  
  await Reservation.bulkCreate(reservations);
}


async function generateFAQs() {
  const faqs = [];
  const hotels = await Hotel.findAll();
  for (let hotel of hotels) {
    for (let i = 0; i < 5; i++) {
      const faq = {
        Q: faker.lorem.sentence(),
        A: faker.lorem.paragraph(),
        hotel_id: hotel.hotel_id
      };
      faqs.push(faq);
    }
  }
  await FAQ.bulkCreate(faqs);
}

async function generateCalendars() {
  const calendars = [];
  const currentDate = new Date();
  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + 90);

  const hotels = await Hotel.findAll();
  for (let hotel of hotels) {
    const roomTypes = await RoomType.findAll({ where: { hotel_id: hotel.hotel_id } });
    for (let roomType of roomTypes) {
      let currentDateIterator = new Date(currentDate);
      while (currentDateIterator <= endDate) {
        const date = new Date(currentDateIterator);

        const availableRooms = roomType.no_of_rooms;

        const calendar = {
          room_type_id: roomType.room_type_id,
          date: date,
          price: faker.random.number({ min: 500, max: 5000 }),
          no_of_avail_rooms: Math.floor(Math.random() * availableRooms) + 1
        };
        calendars.push(calendar);
        currentDateIterator.setDate(currentDateIterator.getDate() + 1);
      }
    }
  }
  await Calendar.bulkCreate(calendars);
}



async function populateDatabase() {
  try {
    await generateUsers();
    await generateHotels();
    await generateImages();
    await generateRoomTypes();
    await generateGroupRoom();
    await generateReservations();
    await generateFAQs();
    await generateCalendars();
    console.log('Database populated successfully.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase();
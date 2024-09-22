const fs = require('fs');

const getRandomStatus = () => {
  const statuses = ['Confirmed', 'Rejected', 'Pending', 'Cancelled'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateRandomDate = () => {
  const start = new Date();
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days ahead
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomData = (count) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const guestDetails = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit number
    const status = getRandomStatus();
    const guests = Math.floor(Math.random() * 10) + 1; // Random number of guests (1 to 10)
    const rooms = [
      { roomtype: 'Single', no_of_rooms: Math.floor(Math.random() * 5) + 1 }, // Random number of single rooms (1 to 5)
      { roomtype: 'Double', no_of_rooms: Math.floor(Math.random() * 5) + 1 }, // Random number of double rooms (1 to 5)
    ];
    const checkin = generateRandomDate().toISOString().split('T')[0];
    const checkout = generateRandomDate().toISOString().split('T')[0];
    const totalPayout = `$${Math.floor(Math.random() * 1000) + 100}`; // Random payment amount ($100 to $1099)

    data.push({
      id: i,
      guestDetails,
      status,
      guests,
      rooms,
      checkin,
      checkout,
      totalPayout,
    });
  }
  return data;
};

const saveDataToFile = (data, fileName) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFile(fileName, jsonData, (err) => {
    if (err) {
      console.error('Error writing data to file:', err);
    } else {
      console.log(`Data has been written to ${fileName}`);
    }
  });
};

// Example usage
const data = generateRandomData(10); // Generate 10 random data objects
const fileName = 'generated_data.json'; // Specify the file name here
saveDataToFile(data, "manager_reservations.js");

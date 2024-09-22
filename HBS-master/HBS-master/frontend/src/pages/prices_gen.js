const fs = require('fs');

function generatePrices() {
    const availableRooms = {};
    const today = new Date();
    const numberOfMonths = 3;

    for (let m = 0; m < numberOfMonths; m++) {
        const month = today.getMonth() + m;
        const year = today.getFullYear() + Math.floor((today.getMonth() + m) / 12);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let d = 0; d < daysInMonth; d++) {
            const date = new Date(year, month, today.getDate() + d);
            const dateString = date.toDateString();
            availableRooms[dateString] = 10;
        }
    }

    return availableRooms;
}

const availableRooms = generatePrices();
const pricesFileContent = `const availableRooms = ${JSON.stringify(availableRooms, null, 4)};\n\nexport default availableRooms;`;

fs.writeFile('availableRooms.js', pricesFileContent, (err) => {
    if (err) {
        console.error('Error writing prices.js file:', err);
    } else {
        console.log('Prices have been written to prices.js file successfully.');
    }
});


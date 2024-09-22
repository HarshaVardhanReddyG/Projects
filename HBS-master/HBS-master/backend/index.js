const express = require('express');
const cors = require('cors')
const sequelize = require('./config');
const UserController = require('./controllers/UserController');
const HotelController = require('./controllers/HotelController');
const ReservationController = require('./controllers/ReservationController');
// const ReservationController = require('./controllers/ReservationController');

const models = require('./models');

const app = express();
app.use(express.json());
app.use(cors())

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
    return sequelize.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS hotel_average_rating_mv AS
    SELECT
        "hotel_id",
        AVG("Rating") AS average_rating
    FROM
        "GroupRoom"
    GROUP BY
        "hotel_id";
    
    CREATE UNIQUE INDEX IF NOT EXISTS hotel_average_rating_mv_unique_idx ON hotel_average_rating_mv ("hotel_id");
    
    CREATE OR REPLACE FUNCTION update_hotel_average_rating_mv()
    RETURNS TRIGGER AS
    $$
    BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY hotel_average_rating_mv;
        RETURN NULL;
    END;
    $$
    LANGUAGE plpgsql;
    
    CREATE OR REPLACE TRIGGER after_reservation_rating_insert
    AFTER INSERT ON "Reservation"
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_hotel_average_rating_mv();
    
    CREATE OR REPLACE TRIGGER after_reservation_rating_update
    AFTER UPDATE ON "Reservation"
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_hotel_average_rating_mv();
    
    CREATE OR REPLACE TRIGGER after_reservation_rating_delete
    AFTER DELETE ON "Reservation"
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_hotel_average_rating_mv();
  `);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use(UserController);
app.use(HotelController);
app.use(ReservationController);


app.use(express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

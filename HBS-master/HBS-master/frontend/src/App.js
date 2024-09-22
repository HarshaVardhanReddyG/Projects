import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import HotelList from './pages/Hotel_list';
import History from './pages/Guest_History';
import HotelPage from './pages/Hotelpage';
import BillPage from './pages/Bill';
import Manager_Dashboard from './pages/Manager_Dashboard';
import Profile from './pages/Profile';
import Manager_hotel from './pages/manager_hotel';
import Manager_reg_1 from './pages/manager_reg_1';
import Manager_calendar from './pages/Manager_calendar';
import Manager_Reservation from './pages/Manager_Reservations';
import ForgotPassword from './pages/ForgotPass';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* <Route exact path="/" element={<Home />} /> */}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/list/:location/:no_guests/:no_of_rooms/:startDate/:endDate" element={<HotelList />} />
          <Route exact path="/history" element={<History />} />
          <Route exact path="/hotel/:hotelId/:no_of_guests/:start_date/:end_date" element={<HotelPage />} />
          <Route exact path="/bill/:gid" element={<BillPage />} />
          <Route exact path="/hotel-page" element={<HotelPage />} />
          <Route exact path = "/manager-dashboard" element = {<Manager_Dashboard/>} />
          <Route exact path ="/Profile" element ={<Profile/>}/>
          <Route exact path = "/manager-hotel" element = {<Manager_hotel/>} />
          <Route exact path = "/manager-reg-1" element = {<Manager_reg_1/>} />
          <Route exact path = "/manager-calendar" element = {<Manager_calendar/>} />
          <Route exact path = "/manager-reservations" element = {<Manager_Reservation/>} />
          <Route exact path = "/forgot-password" element = {<ForgotPassword/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

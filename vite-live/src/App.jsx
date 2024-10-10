import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepageNavBar/HomePage';
import NavBar from './homepageNavBar/NavBar';
import VenueList from './venues/VenueList';  
import CreateVenue from './venues/CreateVenue';  
import EventList from './events/EventList';  // Import the EventList component
import CreateEvent from './events/CreateEvent';  // Import the CreateEvent component

import './App.css'

function App() {
  return (
    <div className="App"> 
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/venues" element={<VenueList />} />
        <Route path="/create-venue" element={<CreateVenue />} />
        
        {/* Event-related routes */}
        <Route path="/events" element={<EventList />} />  {/* Route for EventList */}
        <Route path="/create-event" element={<CreateEvent />} />  {/* Route for CreateEvent */}
      </Routes>
    </div>
  )
}

export default App;

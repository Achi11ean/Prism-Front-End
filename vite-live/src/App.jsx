import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepageNavBar/HomePage';
import NavBar from './homepageNavBar/NavBar';
import VenueList from './venues/VenueList';  
import CreateVenue from './venues/CreateVenue';  
import EventList from './events/EventList';  
import CreateEvent from './events/CreateEvent';

// Import Attendee components
import AttendeeList from './attendees/AttendeeList';  
import CreateAttendee from './attendees/CreateAttendee';  

// Import Artist components
import ArtistList from './artists/ArtistList';  // Import ArtistList component
import CreateArtist from './artists/CreateArtist';  // Import CreateArtist component

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
        <Route path="/events" element={<EventList />} />  
        <Route path="/create-event" element={<CreateEvent />} />  
        
        {/* Attendee-related routes */}
        <Route path="/attendees" element={<AttendeeList />} />  
        <Route path="/create-attendee" element={<CreateAttendee />} />  

        {/* Artist-related routes */}
        <Route path="/artists" element={<ArtistList />} />  {/* Route for ArtistList */}
        <Route path="/create-artist" element={<CreateArtist />} />  {/* Route for CreateArtist */}
      </Routes>
    </div>
  )
}

export default App;
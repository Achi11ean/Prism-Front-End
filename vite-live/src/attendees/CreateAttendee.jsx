import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAttendee.css';  // Ensure you have this CSS file

function CreateAttendee() {
  const [newAttendee, setNewAttendee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    preferred_event_type: '',
    favorite_event_types: [],
    favorite_artist_ids: [],
    favorite_event_ids: [], // New field for favorite event IDs
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]); // New state for events
  const navigate = useNavigate();

  // Fetch available event types, artists, and events on component load
  useEffect(() => {
    fetch('http://localhost:5001/event-types')
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((error) => console.error('Error fetching event types:', error));

    fetch('http://localhost:5001/artists')
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error('Error fetching artists:', error));

    fetch('http://localhost:5001/events') // Fetch events for the event selection
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee({ ...newAttendee, [name]: value });
  };

  const handleEventTypeSelection = (e) => {
    const selectedEventType = e.target.value;
    setNewAttendee((prevState) => ({
      ...prevState,
      favorite_event_types: prevState.favorite_event_types.includes(selectedEventType)
        ? prevState.favorite_event_types.filter((type) => type !== selectedEventType)
        : [...prevState.favorite_event_types, selectedEventType],
    }));
  };

  const handleArtistSelection = (e) => {
    const options = e.target.options;
    const selectedArtists = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedArtists.push(options[i].value);
      }
    }
    setNewAttendee({ ...newAttendee, favorite_artist_ids: selectedArtists });
  };

  const handleFavoriteEventSelection = (e) => {
    const options = e.target.options;
    const selectedEvents = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedEvents.push(options[i].value);
      }
    }
    setNewAttendee({ ...newAttendee, favorite_event_ids: selectedEvents });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5001/attendees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAttendee),
    })
      .then((response) => response.json())
      .then(() => {
        navigate('/attendees'); // Redirect to the attendees list after creation
      })
      .catch((error) => console.error('Error creating attendee:', error));
  };

  return (
    <div className="create-attendee-container">
      <h2>Create Attendee</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name</label>
        <input
          placeholder='[Enter First Name]'
          type="text"
          name="first_name"
          id="first_name"
          value={newAttendee.first_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="last_name">Last Name</label>
        <input
          placeholder='[Enter Last Name]'
          type="text"
          name="last_name"
          id="last_name"
          value={newAttendee.last_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          placeholder='[Enter Email]'
          type="email"
          name="email"
          id="email"
          value={newAttendee.email}
          onChange={handleInputChange}
          required
        />

        <label>Favorite Event Types:</label>
        <select
          className="attendee-select-event-type" 
          multiple 
          value={newAttendee.favorite_event_types} 
          onChange={handleEventTypeSelection}
        >
          {eventTypes.map((eventType) => (
            <option key={eventType} value={eventType}>
              {eventType}
            </option>
          ))}
        </select>

        <label>Favorite Artists:</label>
        <select
          className="attendee-select-artist" 
          multiple 
          value={newAttendee.favorite_artist_ids} 
          onChange={handleArtistSelection}
        >
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <label>Favorite Events:</label>
        <select
          className="attendee-select-event" 
          multiple 
          value={newAttendee.favorite_event_ids} 
          onChange={handleFavoriteEventSelection}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <button type="submit">Create Attendee</button>
      </form>
    </div>
  );
}

export default CreateAttendee;
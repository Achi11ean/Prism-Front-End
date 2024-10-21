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
    favorite_event_ids: [],  // New field for favorite event IDs
    social_media: ''         // Added social media field
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);  // New state for events
  const [artistSearchTerm, setArtistSearchTerm] = useState('');  // State for artist search term
  const [eventSearchTerm, setEventSearchTerm] = useState('');  // State for event search term
  const navigate = useNavigate();

  // Fetch available event types, artists, and events on component load
  useEffect(() => {
    fetch('https://phase4project-xp0u.onrender.com/event-types')
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((error) => console.error('Error fetching event types:', error));

    fetch('https://phase4project-xp0u.onrender.com/artists')
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error('Error fetching artists:', error));

    fetch('https://phase4project-xp0u.onrender.com/events')  // Fetch events for the event selection
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

  const handleArtistSelection = (artistId) => {
    const currentIndex = newAttendee.favorite_artist_ids.indexOf(artistId);
    const newFavoriteArtists = [...newAttendee.favorite_artist_ids];

    if (currentIndex === -1) {
      newFavoriteArtists.push(artistId);
    } else {
      newFavoriteArtists.splice(currentIndex, 1);
    }

    setNewAttendee({ ...newAttendee, favorite_artist_ids: newFavoriteArtists });
  };

  const handleFavoriteEventSelection = (eventId) => {
    const currentIndex = newAttendee.favorite_event_ids.indexOf(eventId);
    const newFavoriteEvents = [...newAttendee.favorite_event_ids];

    if (currentIndex === -1) {
      newFavoriteEvents.push(eventId);
    } else {
      newFavoriteEvents.splice(currentIndex, 1);
    }

    setNewAttendee({ ...newAttendee, favorite_event_ids: newFavoriteEvents });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://phase4project-xp0u.onrender.com/attendees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAttendee),
    })
      .then((response) => response.json())
      .then(() => {
        navigate('/attendees');  // Redirect to the attendees list after creation
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

        <label htmlFor="social_media">Social Media</label>
        <input
          placeholder='[Enter Social Media URL]'
          type="text"
          name="social_media"
          id="social_media"
          value={newAttendee.social_media}
          onChange={handleInputChange}
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
        <input
          type="text"
          placeholder="Search Artists"
          value={artistSearchTerm}
          onChange={(e) => setArtistSearchTerm(e.target.value)}
        />
        <div className="event-checkboxes">
          {artists
            .filter(artist => artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase()))
            .map((artist) => (
              <div key={artist.id}>
                <input
                  type="checkbox"
                  id={`artist-${artist.id}`}
                  value={artist.id}
                  checked={newAttendee.favorite_artist_ids.includes(artist.id)}
                  onChange={() => handleArtistSelection(artist.id)}
                />
                <label htmlFor={`artist-${artist.id}`}>{artist.name}</label>
              </div>
            ))}
        </div>

        <label>Favorite Events:</label>
        <input
          type="text"
          placeholder="Search Events"
          value={eventSearchTerm}
          onChange={(e) => setEventSearchTerm(e.target.value)}
        />
        <div className="event-checkboxes">
          {events
            .filter(event => event.name.toLowerCase().includes(eventSearchTerm.toLowerCase()))
            .map((event) => (
              <div key={event.id}>
                <input
                  type="checkbox"
                  id={`event-${event.id}`}
                  value={event.id}
                  checked={newAttendee.favorite_event_ids.includes(event.id)}
                  onChange={() => handleFavoriteEventSelection(event.id)}
                />
                <label htmlFor={`event-${event.id}`}>{event.name}</label>
              </div>
            ))}
        </div>

        <button type="submit">Create Attendee</button>
      </form>
    </div>
  );
}

export default CreateAttendee;
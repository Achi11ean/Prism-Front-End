import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

function CreateEvent() {
  const [venues, setVenues] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    venue_id: '',
    name: '',
    location: '',
    description: '',
    event_type: '',
    artist_ids: [],
  });
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  // Fetch available venues, event types, and artists from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5001/venues')
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error('Error fetching venues:', error));

    fetch('http://127.0.0.1:5001/event-types')
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((error) => console.error('Error fetching event types:', error));

    fetch('http://127.0.0.1:5001/artists')
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error('Error fetching artists:', error));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message
    // Submit event creation request to the backend
    fetch('http://127.0.0.1:5001/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error); // Throw an error if response is not okay
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Event created:', data);
        navigate("/events"); // Redirect to the event list after creating
      })
      .catch((error) => {
        console.error('Error creating event:', error);
        setErrorMessage(error.message); // Set the error message
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle multiple artist selection
  const handleArtistChange = (e) => {
    const options = e.target.options;
    const selectedArtists = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedArtists.push(options[i].value);
      }
    }
    setFormData({ ...formData, artist_ids: selectedArtists });
  };

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      {errorMessage && <p style={{ color: 'red', fontSize: '2em', TextAlign: 'center', backgroundColor: 'white' }}>{errorMessage}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="eventDate">Date</label>
        <input
          type="date"
          id="eventDate"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="eventTime">Time</label>
        <input
          type="time"
          id="eventTime"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label htmlFor="venueSelect">Venue</label>
        <select
          id="venueSelect"
          name="venue_id"
          value={formData.venue_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a Venue</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>

        <label htmlFor="eventName">Event Name</label>
        <input
          placeholder='[Enter Event Name]'
          type="text"
          id="eventName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="eventLocation">Location</label>
        <input
          placeholder='[CT, New Haven: 122 Broadway Road]'
          type="text"
          id="eventLocation"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="eventDescription">Description</label>
        <textarea
          placeholder='[Example: Discover the captivating world of contemporary art...]'
          id="eventDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="eventTypeSelect">Event Type</label>
        <select
          id="eventTypeSelect"
          name="event_type"
          value={formData.event_type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an Event Type</option>
          {eventTypes.map((eventType, index) => (
            <option key={index} value={eventType}>
              {eventType}
            </option>
          ))}
        </select>
        
        <label htmlFor="artistSelect">Artists</label>
        <select
          id="artistSelect"
          name="artist_ids"
          multiple // Allow multiple selections
          value={formData.artist_ids}
          onChange={handleArtistChange}
        >
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <button type="submit" className="create-event-btn">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
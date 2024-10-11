import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

function CreateEvent() {
  const [venues, setVenues] = useState([]);
  const [eventTypes, setEventTypes] = useState([]); // New state for event types
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    venue_id: '',
    event_type: '', // Add event_type to form data
  });
  const navigate = useNavigate();

  // Fetch available venues and event types from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5001/venues')
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error('Error fetching venues:', error));

    // Assuming you have an endpoint for event types
    fetch('http://127.0.0.1:5001/event-types') // Modify this line according to your backend
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((error) => console.error('Error fetching event types:', error));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit event creation request to the backend
    fetch('http://127.0.0.1:5001/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Event created:', data);
        navigate("/events"); // Redirect to the event list after creating
      })
      .catch((error) => {
        console.error('Error creating event:', error);
        alert('Failed to create event');
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="eventName">Event Name</label>
        <input
          type="text"
          id="eventName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <label htmlFor="eventLocation">Location</label>
        <input
          type="text"
          id="eventLocation"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="eventDescription">Description</label>
        <textarea
          id="eventDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

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

        <label htmlFor="eventTypeSelect">Event Type</label>
        <select
          id="eventTypeSelect"
          name="event_type"
          value={formData.event_type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an Event Type</option>
          <option value="">Select Event Type</option>
          <option value="Drag Shows">Drag Shows</option>
          <option value="Live Lip Syncing">Live Lip Syncing</option>
          <option value="Live Singing">Live Singing</option>
          <option value="Comedy Nights">Comedy Nights</option>
          <option value="Open Mic">Open Mic</option>
          <option value="Karaoke">Karaoke</option>
          <option value="DJ Sets">DJ Sets</option>
          <option value="Dance Performances">Dance Performances</option>
          <option value="Themed Parties">Themed Parties</option>
          <option value="Fundraising Events">Fundraising Events</option>
          <option value="Talent Show">Talent Show</option>
          <option value="Variety Show">Variety Show</option>
          <option value="Music Festival">Music Festival</option>
          <option value="Art Exhibitions">Art Exhibitions</option>
          <option value="Spoken Word Performances">Spoken Word Performances</option>
          <option value="Fashion Shows">Fashion Shows</option>
          {eventTypes.map((eventType) => (
            <option key={eventType.id} value={eventType.name}>
              {eventType.name}
            </option>
          ))}
        </select>

        <button type="submit" className="create-event-btn">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
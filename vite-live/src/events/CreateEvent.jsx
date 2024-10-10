import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './CreateEvent.css';  // Import your CSS file

function CreateEvent() {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    venue_id: ''
  });
  const navigate = useNavigate();  // Initialize navigate

  // Fetch available venues from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5001/venues')
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error('Error fetching venues:', error));
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
        // Redirect back to the event list after creating
        navigate("/events");
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

        <button type="submit" className="create-event-btn">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
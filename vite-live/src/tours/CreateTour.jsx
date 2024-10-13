import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTour.css';

function CreateTour() {
  const [events, setEvents] = useState([]); // State for events
  const [venues, setVenues] = useState([]); // State for venues
  const [artists, setArtists] = useState([]); // State for artists
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    social_media_handles: '',
    event_ids: [], // For linking to events
    created_by_id: '', // For venue
    created_by_artist_id: '', // For artist
  });
  const [eventSearchTerm, setEventSearchTerm] = useState(""); // State for event search term

  const navigate = useNavigate();

  // Fetch available events, venues, and artists from the backend
  useEffect(() => {
    fetch('http://localhost:5001/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));

    fetch('http://localhost:5001/venues')
      .then(response => response.json())
      .then(data => setVenues(data))
      .catch(error => console.error('Error fetching venues:', error));

    fetch('http://localhost:5001/artists')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error('Error fetching artists:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure event_ids are integers
    const updatedFormData = {
      ...formData,
      event_ids: formData.event_ids.map(Number), // Convert strings to numbers
    };

    // Check that either a venue or an artist is selected
    if (!updatedFormData.created_by_id && !updatedFormData.created_by_artist_id) {
      alert('Please select either a venue or an artist as the creator.');
      return;
    }
    
    // Submit tour creation request to the backend
    fetch('http://localhost:5001/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFormData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Tour created:', data);
        navigate("/tours"); // Redirect to the tour list after creating
      })
      .catch(error => {
        console.error('Error creating tour:', error);
        alert('Failed to create tour');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle multiple event selection with checkboxes
  const handleEventChange = (eventId) => {
    const currentIndex = formData.event_ids.indexOf(eventId);
    const newEventIds = [...formData.event_ids];

    if (currentIndex === -1) {
      // If the event is not selected, add it
      newEventIds.push(eventId);
    } else {
      // If the event is already selected, remove it
      newEventIds.splice(currentIndex, 1);
    }

    setFormData({ ...formData, event_ids: newEventIds });
  };

  return (
    <div className="create-tour-container">
      <h2>Create Tour</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tourName">Tour Name</label>
        <input
          placeholder='[Enter Tour Name]'
          type="text"
          id="tourName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="tourStartDate">Start Date</label>
        <input
          placeholder='[Select Start Date]'
          type="date"
          id="tourStartDate"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="tourEndDate">End Date</label>
        <input
          placeholder='[Select End Date]'
          type="date"
          id="tourEndDate"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="tourDescription">Description</label>
        <textarea
          placeholder='[Enter Tour Description]'
          id="tourDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="socialMediaHandles">Social Media Handles</label>
        <input
          placeholder='[Enter Social Media Links]'
          type="text"
          id="socialMediaHandles"
          name="social_media_handles"
          value={formData.social_media_handles}
          onChange={handleChange}
        />

        <label htmlFor="eventSelect">Events</label>
        <input
          className="searchedit"
          type="text"
          placeholder="Search Events"
          value={eventSearchTerm}
          onChange={(e) => setEventSearchTerm(e.target.value)} // Capture search term
        />
        <div className="event-checkboxes">
          {events
            .filter(event =>
              event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
            )
            .map((event) => (
              <div key={event.id}>
                <input
                  type="checkbox"
                  id={`event-${event.id}`}
                  value={event.id}
                  checked={formData.event_ids.includes(event.id)}
                  onChange={() => handleEventChange(event.id)}
                />
                <label htmlFor={`event-${event.id}`}>{event.name}</label>
              </div>
            ))}
        </div>

        {/* Dropdown for selecting a venue */}
        <label htmlFor="venueSelect">Created By (Select Venue)</label>
        <select
          id="venueSelect"
          name="created_by_id"
          value={formData.created_by_id}
          onChange={handleChange}
        >
          <option value="">Select Venue</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>

        {/* Dropdown for selecting an artist */}
        <label htmlFor="artistSelect">Created By (Select Artist)</label>
        <select
          id="artistSelect"
          name="created_by_artist_id"
          value={formData.created_by_artist_id}
          onChange={handleChange}
        >
          <option value="">Select Artist</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <button type="submit">Create Tour</button>
      </form>
    </div>
  );
}

export default CreateTour;
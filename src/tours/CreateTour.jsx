import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTour.css';
import { useAuth } from "../AuthContext"; // Import useAuth to access user data

function CreateTour() {
  const [events, setEvents] = useState([]); // State for events
  const [venues, setVenues] = useState([]); // State for venues
  const { user } = useAuth(); // Access the current user from AuthContext

  const [artists, setArtists] = useState([]); // State for artists
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    social_media_handles: '',
    event_ids: [], // For linking to events
  });
  const [eventSearchTerm, setEventSearchTerm] = useState(''); // State for event search term
  const [venueSearchTerm, setVenueSearchTerm] = useState(''); // State for venue search term
  const [artistSearchTerm, setArtistSearchTerm] = useState(''); // State for artist search term

  const navigate = useNavigate();

  // Fetch available events, venues, and artists from the backend
  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));

    fetch('/api/venues')
      .then(response => response.json())
      .then(data => setVenues(data))
      .catch(error => console.error('Error fetching venues:', error));

    fetch('/api/artists')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error('Error fetching artists:', error));
  }, []);
  const formatToMMDDYYYY = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Ensure event_ids are integers and format dates
    const updatedFormData = {
      ...formData,
      start_date: formatToMMDDYYYY(formData.start_date),
      end_date: formatToMMDDYYYY(formData.end_date),
      event_ids: formData.event_ids.map(Number),
      user_id: user.user_id

    };
    // Submit tour creation request to the backend
    fetch('/api/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFormData),
      credentials: 'include', // Ensures the session data (user_id) is sent with the request

    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create tour');
        }
        return response.json();
      })
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



        <button type="submit">Create Tour</button>
      </form>
    </div>
  );
}

export default CreateTour;
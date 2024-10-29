import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';
import { useAuth } from '../AuthContext'; // Import useAuth to access user data

function CreateEvent() {
  const { user } = useAuth(); // Retrieve the current user from context

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
  const [venueSearchTerm, setVenueSearchTerm] = useState(''); // State for venue search
  const [artistSearchTerm, setArtistSearchTerm] = useState(''); // State for artist search
  const navigate = useNavigate();

  // Fetch available venues, event types, and artists from the backend
  useEffect(() => {
    fetch('/api/venues')
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error('Error fetching venues:', error));

    fetch('/api/event-types')
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((error) => console.error('Error fetching event types:', error));

    fetch('/api/artists')
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error('Error fetching artists:', error));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message
    // Submit event creation request to the backend
    const eventToSubmit = {
      ...formData,
      user_id: user.user_id
    };
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventToSubmit), // Use eventToSubmit here
      credentials: 'include',

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

  // Handle multiple artist selection with checkboxes
  const handleArtistSelection = (artistId) => {
    setFormData((prevState) => {
      const isSelected = prevState.artist_ids.includes(artistId);
      return {
        ...prevState,
        artist_ids: isSelected
          ? prevState.artist_ids.filter((id) => id !== artistId)
          : [...prevState.artist_ids, artistId],
      };
    });
  };

  // Filter venues based on search input
  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase())
  );

  // Filter artists based on search input
  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase())
  );

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      {errorMessage && (
        <p style={{ color: 'red', fontSize: '2em', textAlign: 'center', backgroundColor: 'white' }}>
          {errorMessage}
        </p>
      )} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <label className="labelss"  htmlFor="eventDate">Date:</label>
        <input
          className="date"
          type="date"
          id="eventDate"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label className="labelss"  htmlFor="eventTime">Time:</label>
        <input
          className="date"
          type="time"
          id="eventTime"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label className="labelss"  htmlFor="venueSelect">Venue:</label>
        {/* Search input for venues */}
        <input
          type="text"
          placeholder="Search Venues..."
          value={venueSearchTerm}
          onChange={(e) => setVenueSearchTerm(e.target.value)}
          className="venue-search"
        />
        <select
          id="venueSelect"
          name="venue_id"
          value={formData.venue_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a Venue</option>
          {filteredVenues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>

        <label className="labelss" htmlFor="eventName">Event Name:</label>
        <input
          placeholder='[Enter Event Name]'
          type="text"
          id="eventName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="labelss"  htmlFor="eventLocation">Location:</label>
        <input
          placeholder='[CT, New Haven: 122 Broadway Road]'
          type="text"
          id="eventLocation"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label className="labelss"  htmlFor="eventDescription">Description:</label>
        <textarea
          placeholder='[Example: Discover the captivating world of contemporary art...]'
          id="eventDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label className="labelss" htmlFor="eventTypeSelect">Event Type:</label>
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

        <label className="labelss" htmlFor="artistSelect">Artists</label>
        {/* Search input for artists */}
        <input
          type="text"
          placeholder="Search Artists..."
          value={artistSearchTerm}
          onChange={(e) => setArtistSearchTerm(e.target.value)}
          className="artist-search"
        />
        <div className="event-checkboxes" style={{ maxHeight: "150px", overflowY: "scroll", border: "1px solid #ccc", padding: "5px" }}>
          {filteredArtists.map((artist) => (
            <div key={artist.id}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.artist_ids.includes(artist.id)}
                  onChange={() => handleArtistSelection(artist.id)}
                />
                {artist.name}
              </label>
            </div>
          ))}
        </div>

        <button type="submit" className="create-event-btn">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
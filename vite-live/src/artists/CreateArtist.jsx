import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateArtist.css';

function CreateArtist() {
  const [events, setEvents] = useState([]); // State for events
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    background: '',
    songs: '',
    event_ids: [], // For linking to events
  });

  const navigate = useNavigate();

  // Fetch available events from the backend
  useEffect(() => {
    fetch('http://localhost:5001/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure event_ids are integers
    const updatedFormData = {
      ...formData,
      event_ids: formData.event_ids.map(Number), // Convert strings to numbers
    };
    
    // Submit artist creation request to the backend
    fetch('http://localhost:5001/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFormData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Artist created:', data);
        navigate("/artists"); // Redirect to the artist list after creating
      })
      .catch(error => {
        console.error('Error creating artist:', error);
        alert('Failed to create artist');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle multiple event selection
  const handleEventChange = (e) => {
    const options = e.target.options;
    const selectedEvents = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedEvents.push(options[i].value);
      }
    }
    setFormData({ ...formData, event_ids: selectedEvents });
  };

  return (
    <div className="create-artist-container">
      <h2>Create Artist</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="artistName">Artist Name</label>
        <input
          placeholder='[Enter Stage Name]'
          type="text"
          id="artistName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="artistAge">Age</label>
        <input
          placeholder='[Enter Age]'
          type="number"
          id="artistAge"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label htmlFor="artistBackground">Background</label>
        <textarea
          placeholder='[Social Media: @HarmonicEssence | Performancs Goals:... | Experience:...]'
          id="artistBackground"
          name="background"
          value={formData.background}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="artistSongs">Songs</label>
        <input
          placeholder='[Enter song names or links you can perform(to) or N/A]'
          type="text"
          id="artistSongs"
          name="songs"
          value={formData.songs}
          onChange={handleChange}
          required
        />

        <label htmlFor="eventSelect">Events</label>
        <select
          id="eventSelect"
          name="event_ids"
          multiple // Allow multiple selections
          value={formData.event_ids}
          onChange={handleEventChange}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <button type="submit">Create Artist</button>
      </form>
    </div>
  );
}

export default CreateArtist;
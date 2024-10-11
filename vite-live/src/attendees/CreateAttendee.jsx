import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAttendee.css';  // Import your CSS file
function CreateAttendee() {
  const [newAttendee, setNewAttendee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    preferred_event_type: '',
    favorite_event_ids: [],  // For storing selected favorite events
  });
  const [events, setEvents] = useState([]);  // For holding the list of events
  const navigate = useNavigate();

  // Fetch available events on component load
  useEffect(() => {
    fetch('http://localhost:5001/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee({ ...newAttendee, [name]: value });
  };

  const handleEventSelection = (e) => {
    const selectedEventId = parseInt(e.target.value);
    setNewAttendee((prevState) => ({
      ...prevState,
      favorite_event_ids: prevState.favorite_event_ids.includes(selectedEventId)
        ? prevState.favorite_event_ids.filter((id) => id !== selectedEventId)
        : [...prevState.favorite_event_ids, selectedEventId],
    }));
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
        navigate('/attendees');
      })
      .catch((error) => console.error('Error creating attendee:', error));
  };

  return (
    <div className="create-attendee-container">  {/* Apply the class from your CSS */}
      <h2>Create Attendee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={newAttendee.first_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={newAttendee.last_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newAttendee.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="preferred_event_type"
          placeholder="Preferred Event Type"
          value={newAttendee.preferred_event_type}
          onChange={handleInputChange}
        />
        <div>
          <label>Favorite Events:</label>
          <select className="selectevent" multiple value={newAttendee.favorite_event_ids} onChange={handleEventSelection}>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Attendee</button>
      </form>
    </div>
  );
}

export default CreateAttendee;
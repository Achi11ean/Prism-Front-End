import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAttendee.css';  // Import your CSS file

function CreateAttendee() {
  const [newAttendee, setNewAttendee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    preferred_event_type: '',
    favorite_event_types: [],  // For storing selected favorite event types
  });
  const [eventTypes, setEventTypes] = useState([]);  // For holding the list of event types
  const navigate = useNavigate();

  // Fetch available event types on component load
  useEffect(() => {
    fetch('http://localhost:5001/event-types')
      .then((response) => response.json())
      .then((data) => setEventTypes(data))  // Assuming backend returns event types as an array
      .catch((error) => console.error('Error fetching event types:', error));
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

        <div>
          <label>Favorite Event Types:</label>
          <select className="select-event-type" multiple value={newAttendee.favorite_event_types} onChange={handleEventTypeSelection}>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
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
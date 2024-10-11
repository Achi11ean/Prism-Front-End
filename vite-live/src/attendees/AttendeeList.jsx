import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendeeList.css';

function AttendeeList() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]); // For holding the list of events
  const [eventTypes, setEventTypes] = useState([]); // For holding the event types
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    favorite_event_ids: [], // For storing selected favorite events during editing
    favorite_event_types: [], // For storing selected favorite event types during editing
  });
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const navigate = useNavigate();

  useEffect(() => {
    const url = searchTerm
      ? `http://localhost:5001/attendees/search?name=${searchTerm}`
      : 'http://localhost:5001/attendees';

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch attendees");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setErrorMessage('No attendees found matching your search.');
        } else {
          setErrorMessage(''); // Clear error message if attendees are found
          setAttendees(data); // Update the attendees list
        }
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage('No Matching Criteria.');
        setLoading(false);
        console.error('Error fetching attendees:', error);
      });

    // Fetch available events for favorite events selection
    fetch("http://localhost:5001/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    // Fetch event types for favorite event types selection
    fetch("http://localhost:5001/event-types")
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((error) => console.error("Error fetching event types:", error));
  }, [searchTerm]); // Depend on searchTerm

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/attendees/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete attendee");
        }
        setAttendees((prevAttendees) => 
          prevAttendees.filter((attendee) => attendee.id !== id)
        );
      })
      .catch((error) => {
        console.error('Error deleting attendee:', error);
      });
  };

  const handleEdit = (attendee) => {
    setEditingId(attendee.id);
    setEditData({
      first_name: attendee.first_name,
      last_name: attendee.last_name,
      email: attendee.email,
      favorite_event_ids: attendee.favorite_events
        ? attendee.favorite_events.map((event) => event.id)
        : [],
      favorite_event_types: attendee.favorite_event_types || [], // Handle event types
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEventSelection = (e) => {
    const selectedEventId = parseInt(e.target.value);
    setEditData((prevState) => ({
      ...prevState,
      favorite_event_ids: prevState.favorite_event_ids.includes(selectedEventId)
        ? prevState.favorite_event_ids.filter((id) => id !== selectedEventId)
        : [...prevState.favorite_event_ids, selectedEventId],
    }));
  };

  const handleEventTypeSelection = (e) => {
    const selectedEventType = e.target.value;
    setEditData((prevState) => ({
      ...prevState,
      favorite_event_types: prevState.favorite_event_types.includes(selectedEventType)
        ? prevState.favorite_event_types.filter((type) => type !== selectedEventType)
        : [...prevState.favorite_event_types, selectedEventType],
    }));
  };

  const handleSave = (id) => {
    const updatedAttendee = {
      first_name: editData.first_name,
      last_name: editData.last_name,
      email: editData.email,
      favorite_event_ids: editData.favorite_event_ids,
      favorite_event_types: editData.favorite_event_types, // Include favorite event types
    };
  
    fetch(`http://localhost:5001/attendees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAttendee),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save attendee");
        }
        return response.json();
      })
      .then((data) => {
        setAttendees((prevAttendees) =>
          prevAttendees.map((attendee) =>
            attendee.id === id ? { ...data } : attendee
          )
        );
        setEditingId(null);  // Reset the editing state after successful save
      })
      .catch((error) => {
        console.error("Error saving attendee:", error);
      });
  };
  
  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Update search term
  };

  if (loading) {
    return <p>Loading attendees...</p>;
  }

  return (
    <div className="attendee-list-container">
      <h1>Attendees List</h1>
      <input 
        type="text" 
        placeholder="Search attendees by name..." 
        value={searchTerm}
        onChange={handleSearchChange} // Update on input change
      />
      {errorMessage && <p>{errorMessage}</p>} {/* Display error message */}
      <button className="Create" onClick={() => navigate("/create-attendee")}>
        Create New Attendee
      </button>
      {attendees.length === 0 ? (
        <p>No attendees found.</p>
      ) : (
        <table className="attendee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Favorite Events</th>
              <th>Favorite Event Types</th> {/* Add this line for the new column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td>{attendee.id}</td>
                <td>
                  {editingId === attendee.id ? (
                    <input
                      type="text"
                      name="first_name"
                      value={editData.first_name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    attendee.first_name
                  )}
                </td>
                <td>
                  {editingId === attendee.id ? (
                    <input
                      type="text"
                      name="last_name"
                      value={editData.last_name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    attendee.last_name
                  )}
                </td>
                <td>
                  {editingId === attendee.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    attendee.email
                  )}
                </td>
                <td>
                  {editingId === attendee.id ? (
                    <select
                      className="selectevent"
                      multiple
                      value={editData.favorite_event_ids}
                      onChange={handleEventSelection}
                    >
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <ul>
                      {attendee.favorite_events && attendee.favorite_events.length > 0 ? (
                        attendee.favorite_events.map((event) => (
                          <li key={event.id}>{event.name}</li>
                        ))
                      ) : (
                        <li>No favorite events</li>
                      )}
                    </ul>
                  )}
                </td>
                <td>
                  {editingId === attendee.id ? (
                    <select
                      className="selecteventtypes"
                      multiple
                      value={editData.favorite_event_types}
                      onChange={handleEventTypeSelection}
                    >
                      {eventTypes.map((eventType, index) => (
                        <option key={index} value={eventType}>
                          {eventType}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <ul>
                      {attendee.favorite_event_types && attendee.favorite_event_types.length > 0 ? (
                        attendee.favorite_event_types.map((type, index) => (
                          <li key={index}>{type}</li>
                        ))
                      ) : (
                        <li>No favorite event types</li>
                      )}
                    </ul>
                  )}
                </td>
                <td>
                  {editingId === attendee.id ? (
                    <>
                      <button className="Saveme" onClick={() => handleSave(attendee.id)}>
                        Save
                      </button>
                      <button className="Cancelme" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="editbutton" onClick={() => handleEdit(attendee)}>
                        Edit
                      </button>
                      <button className="deletebutton" onClick={() => handleDelete(attendee.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AttendeeList;
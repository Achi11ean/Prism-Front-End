import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendeeList.css';

function AttendeeList() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]); // For holding the list of events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    favorite_event_ids: [], // For storing selected favorite events during editing
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch attendees
    fetch("http://localhost:5001/attendees")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch attendees");
        }
        return response.json();
      })
      .then((data) => {
        setAttendees(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    // Fetch available events for favorite events selection
    fetch("http://localhost:5001/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this attendee?")) {
      fetch(`http://localhost:5001/attendees/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setAttendees(attendees.filter((attendee) => attendee.id !== id));
          } else {
            alert("Failed to delete the attendee.");
          }
        })
        .catch((error) => console.error("Error deleting attendee:", error));
    }
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

  const handleSave = (id) => {
    // Create an updated attendee object from the edit data
    const updatedAttendee = {
      first_name: editData.first_name,
      last_name: editData.last_name,
      email: editData.email,
      favorite_event_ids: editData.favorite_event_ids, // Ensure this captures the selected favorite events
    };

    // Optimistically update the UI before the API call
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee.id === id ? { ...attendee, ...updatedAttendee } : attendee
      )
    );

    // Make the API call to save the updated attendee
    fetch(`http://localhost:5001/attendees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAttendee), // Send updated data
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to save attendee");
        }
        return response.json(); // Get the updated attendee data from the response
    })
    .then((data) => {
        // If the API returns the updated attendee data, use it to update the local state
        setAttendees((prevAttendees) =>
          prevAttendees.map((attendee) =>
            attendee.id === id ? { ...data } : attendee // Update with the response data
          )
        );
        setEditingId(null); // Reset editing state
    })
    .catch((error) => {
        console.error("Error saving attendee:", error);
        // Optionally, you might want to revert the optimistic update here if needed
    });
};

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) {
    return <p>Loading attendees...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="attendee-list-container">
      <h1>Attendees List</h1>
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
                {/* Displaying favorite events */}
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
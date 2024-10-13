import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AttendeeList.css";

function AttendeeList() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    favorite_event_ids: [],
    favorite_event_types: [],
    favorite_artist_ids: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Fetch artists
    fetch("http://localhost:5001/artists")
      .then((response) => response.json())
      .then((data) => {
        setArtists(data);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
      });
  }, []);

  useEffect(() => {
    const url = searchTerm
      ? `http://localhost:5001/attendees/search?name=${searchTerm}`
      : "http://localhost:5001/attendees";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched attendees:", data);  // Debugging log
        if (Array.isArray(data)) { // Ensure it's an array
          setAttendees(data);
          setErrorMessage(""); // Reset error message if data is fetched
        } else {
          setErrorMessage("Fetched data is not an array.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage("No Matching Criteria.");
        setLoading(false);
        console.error("Error fetching attendees:", error);
      });

    fetch("http://localhost:5001/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    fetch("http://localhost:5001/event-types")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched event types:", data); // Debugging log
        setEventTypes(data);
      })
      .catch((error) => console.error("Error fetching event types:", error));
  }, [searchTerm]);

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/attendees/${id}`, {
      method: "DELETE",
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
        console.error("Error deleting attendee:", error);
      });
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
      favorite_event_types: prevState.favorite_event_types.includes(
        selectedEventType
      )
        ? prevState.favorite_event_types.filter(
            (type) => type !== selectedEventType
          )
        : [...prevState.favorite_event_types, selectedEventType],
    }));
  };

  const handleEdit = (attendee) => {
    console.log("Editing attendee:", attendee);
    setEditingId(attendee.id);
    setEditData({
      first_name: attendee.first_name,
      last_name: attendee.last_name,
      email: attendee.email,
      favorite_event_ids: attendee.favorite_events
        ? attendee.favorite_events.map((event) => event.id)
        : [],
      favorite_event_types: Array.isArray(attendee.favorite_event_types)
        ? attendee.favorite_event_types
        : attendee.favorite_event_types.split(","),
      favorite_artist_ids: attendee.favorite_artists
        ? attendee.favorite_artists.map((artist) => artist.id)
        : [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleArtistSelection = (e) => {
    const selectedArtistId = parseInt(e.target.value);
    setEditData((prevState) => ({
      ...prevState,
      favorite_artist_ids: prevState.favorite_artist_ids.includes(
        selectedArtistId
      )
        ? prevState.favorite_artist_ids.filter((id) => id !== selectedArtistId)
        : [...prevState.favorite_artist_ids, selectedArtistId],
    }));
  };

  const handleSave = (id) => {
    const updatedAttendee = {
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
        favorite_event_ids: editData.favorite_event_ids,
        favorite_event_types: editData.favorite_event_types,
        favorite_artist_ids: editData.favorite_artist_ids,
    };

    console.log("Updated Attendee Data:", updatedAttendee); // Log for debugging

    fetch(`http://localhost:5001/attendees/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAttendee),
    })
    .then((response) => {
        console.log("Response status:", response.status); // Log response status
        if (!response.ok) {
            return response.json().then((errorData) => {
                console.error("Error response from server:", errorData);
                throw new Error("Failed to save attendee");
            });
        }
        return response.json();
    })
    .then((data) => {
        console.log("Data returned from the server:", data); // Log returned data
        setAttendees((prevAttendees) =>
            prevAttendees.map((attendee) =>
                attendee.id === id ? { ...data } : attendee
            )
        );
        setEditingId(null); // Exit editing mode
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
    setSearchTerm(value);
  };

  if (loading) {
    return <p>Loading attendees...</p>;
  }

  return (
    <div className="attendee-list-container">
      <h1>Attendees List</h1>
      <input
      className="Searchme"
        type="text"
        placeholder="Search attendees by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {errorMessage && <p>{errorMessage}</p>}
      <button className="Createme" onClick={() => navigate("/create-attendee")}>
        Create New Attendee
      </button>
      {attendees.length === 0 ? (
        <p id="error">No Matching Criteria.</p>
      ) : (
        <table className="attendee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Favorite Events</th>
              <th>Favorite Event Types</th>
              <th>Favorite Artists</th>
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
                      {attendee.favorite_events &&
                      attendee.favorite_events.length > 0 ? (
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
                      {eventTypes.map((eventType) => (
                        <option key={eventType} value={eventType}>
                          {eventType}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <ul>
                      {Array.isArray(attendee.favorite_event_types) &&
                      attendee.favorite_event_types.length > 0 ? (
                        attendee.favorite_event_types.map((type) => (
                          <li key={type}>{type}</li> 
                        ))
                      ) : (
                        <li>No favorite event types</li>
                      )}
                    </ul>
                  )}
                </td>
                <td>
                  {editingId === attendee.id ? (
                    <select
                      className="selecteventtypes"
                      multiple
                      value={editData.favorite_artist_ids}
                      onChange={handleArtistSelection}
                    >
                      {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                          {artist.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <ul>
                      {attendee.favorite_artists &&
                      attendee.favorite_artists.length > 0 ? (
                        attendee.favorite_artists.map((artist) => (
                          <li key={artist.id}>{artist.name}</li> 
                        ))
                      ) : (
                        <li>No favorite artists</li>
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
                      <button className="Cancelme" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="editbutton"onClick={() => handleEdit(attendee)}>Edit</button>
                      <button className="deletebutton"onClick={() => handleDelete(attendee.id)}>
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

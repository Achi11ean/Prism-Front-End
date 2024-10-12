import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventList.css";

function EventList() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    venue_id: "",
    event_type: "", // Add event_type to form data for editing
    artist_ids: [], // Add artist_ids for multiple artist selections
  });
  const [errorMessage, setErrorMessage] = useState("");
  const formatTimeTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const period = +hours >= 12 ? "PM" : "AM";
    const hours12 = +hours % 12 || 12; // Convert to 12-hour format
    return `${hours12}:${minutes} ${period}`;
  };
  const navigate = useNavigate();

  // Fetch events from the backend
  useEffect(() => {
    const url = searchTerm
      ? `http://127.0.0.1:5001/events/search?name=${searchTerm}`
      : "http://127.0.0.1:5001/events";
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setErrorMessage("No events found matching your search.");
        } else {
          setErrorMessage(""); // Clear error message if events are found
          setEvents(data); // Update the events list
        }
      })
      .catch((error) => {
        setErrorMessage("No Matching Criteria.");
        console.error("Error fetching events:", error);
      });
  }, [searchTerm]);

  // Fetch venues for dropdown selection during editing
  useEffect(() => {
    fetch("http://127.0.0.1:5001/venues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error("Error fetching venues:", error));
  }, []);

  // Handle the edit button click to edit an event
  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setEditFormData({
      name: event.name,
      date: event.date.split('T')[0], // Format as YYYY-MM-DD
      time: event.time,
      location: event.location,
      description: event.description,
      venue_id: event.venue.id,
      event_type: event.event_type, // Include event_type in edit form
      artist_ids: event.artists.map(artist => artist.id), // Preselect artists
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Save the updated event data
  const handleSaveClick = (eventId) => {
    const isConfirmed = window.confirm("Please verify the date before saving.");
    if (isConfirmed) {
      const updatedFormData = {
        ...editFormData,
        date: new Date(editFormData.date).toISOString().split("T")[0], // Ensure date is in YYYY-MM-DD format
      };
      fetch(`http://127.0.0.1:5001/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      })
        .then((response) => response.json())
        .then((updatedEvent) => {
          setEvents(events.map((event) => (event.id === eventId ? updatedEvent : event)));
          setEditingEventId(null); // Exit editing mode
        })
        .catch((error) => {
          console.error("Error updating event:", error);
          alert("Failed to update event");
        });
    }
  };

  // Handle canceling the edit
  const handleCancelClick = () => {
    setEditingEventId(null);
  };

  // Handle deleting an event
  const handleDeleteClick = (eventId) => {
    fetch(`http://127.0.0.1:5001/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => {
        setEvents(events.filter((event) => event.id !== eventId));
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      {/* Create button */}
      <button className="Create" onClick={() => navigate("/create-event")}>
        Create New Event
      </button>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by event name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {errorMessage && (
        <p className="error-message" style={{ color: "black", fontSize: "2em", backgroundColor: "white" }}>
          {errorMessage}
        </p>
      )}
      <table border="1" cellPadding="10" className="event-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Description</th>
            <th>Venue</th>
            <th>Event Type</th>
            <th>Artists</th> {/* New column for Artists */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              {editingEventId === event.id ? (
                <>
                  <td>{event.id}</td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="time"
                      value={editFormData.time}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <select
                      className="selectedit"
                      name="venue_id"
                      value={editFormData.venue_id}
                      onChange={handleEditChange}
                    >
                      <option value="" disabled>
                        Select Venue
                      </option>
                      {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="selectedit"
                      name="event_type"
                      value={editFormData.event_type}
                      onChange={handleEditChange}
                    >
                      <option value="" disabled>Select Event Type</option>
                      <option value="Drag Shows">Drag Shows</option>
                      <option value="Live Lip Syncing">Live Lip Syncing</option>
                      <option value="Live Singing">Live Singing</option>
                      <option value="Comedy Nights">Comedy Nights</option>
                      <option value="Open Mic">Open Mic</option>
                      <option value="Karaoke">Karaoke</option>
                      <option value="DJ Sets">DJ Sets</option>
                      <option value="Dance Performances">Dance Performances</option>
                      <option value="Themed Parties">Themed Parties</option>
                      <option value="Fundraising Events">Fundraising Events</option>
                      <option value="Talent Show">Talent Show</option>
                      <option value="Variety Show">Variety Show</option>
                      <option value="Music Festival">Music Festival</option>
                      <option value="Art Exhibitions">Art Exhibitions</option>
                      <option value="Spoken Word Performances">Spoken Word Performances</option>
                      <option value="Fashion Shows">Fashion Shows</option>
                    </select>
                  </td>
                  <td>
                    <button className="Saveme" onClick={() => handleSaveClick(event.id)}>
                      Save
                    </button>
                    <button className="Cancelme" onClick={handleCancelClick}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{formatTimeTo12Hour(event.time)}</td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>{event.venue.name}</td>
                  <td>{event.event_type}</td>
                  <td>{event.artists.map(artist => artist.name).join(', ')}</td> {/* List of artists */}
                  <td>
                    <button className="editbutton" onClick={() => handleEditClick(event)}>
                      Edit
                    </button>
                    <button className="deletebutton" onClick={() => handleDeleteClick(event.id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventList;
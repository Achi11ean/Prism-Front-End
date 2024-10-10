import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventList.css";

function EventList() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]); // Define venues state
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEventId, setEditingEventId] = useState(null); // Track the event being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    venue_id: "",
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
    let formattedDate = event.date;

    // Check if event.date is valid and can be converted to a Date object
    if (event.date) {
      const parsedDate = new Date(event.date);

      if (!isNaN(parsedDate.getTime())) {
        // Check if it's a valid date
        formattedDate = parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      } else {
        console.error("Invalid date format for event:", event.date);
      }
    }

    setEditingEventId(event.id);
    setEditFormData({
      name: event.name,
      date: formattedDate, // Use the correctly formatted date
      time: event.time,
      location: event.location,
      description: event.description,
      venue_id: event.venue.id,
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Save the updated event data
  const handleSaveClick = (eventId) => {
    // Ask for confirmation before saving
    const isConfirmed = window.confirm("Please verify the date before saving.");
    if (isConfirmed) {
      // Format the date properly before sending it to the backend
      const formattedDate = new Date(editFormData.date)
        .toISOString()
        .split("T")[0]; // Ensure date is in YYYY-MM-DD format
      // Create a new object for the updated data to send
      const updatedFormData = {
        ...editFormData,
        date: formattedDate, // Apply the formatted date
      };
      // Proceed with saving the event
      fetch(`http://127.0.0.1:5001/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData), // Send the updated form data with the correct date
      })
        .then((response) => response.json())
        .then((updatedEvent) => {
          // Update the events list with the newly updated event
          setEvents(
            events.map((event) => (event.id === eventId ? updatedEvent : event))
          );
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
        <p
          className="error-message"
          style={{ color: "black", fontSize: "2em", backgroundColor: "white" }}
        >
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
                    <button
                      className="Saveme"
                      onClick={() => handleSaveClick(event.id)}
                    >
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
                  <td>{formatTimeTo12Hour(event.time)}</td>{" "}
                  {/* Convert time to 12-hour format */}
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>{event.venue.name}</td>
                  <td>
                    <button
                      className="editbutton"
                      onClick={() => handleEditClick(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="deletebutton"
                      onClick={() => handleDeleteClick(event.id)}
                    >
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

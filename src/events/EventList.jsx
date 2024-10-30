import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventList.css";
import { useAuth } from '../AuthContext'; // Import useAuth to access user data


function EventList() {
  const { user } = useAuth(); // Retrieve the current user from context

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const isAdmin = user?.user_type === 'admin';

  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    venue_id: "",
    event_type: "",
    artist_ids: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [venueSearchTerm, setVenueSearchTerm] = useState(""); // State for venue search input
  const [displayLimit, setDisplayLimit] = useState(5); // Limit number of events displayed by default

  const formatTimeTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const period = +hours >= 12 ? "PM" : "AM";
    const hours12 = +hours % 12 || 12; // Convert to 12-hour format
    return `${hours12}:${minutes} ${period}`;
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  const navigate = useNavigate();

  // Fetch events, venues, and artists from the backend
  useEffect(() => {
    const url = searchTerm
      ? `/api/events/search?searchTerm=${searchTerm}`
      : "/api/events";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        if (data.length === 0) {
          setErrorMessage("No events found matching your search.");
        } else {
          setErrorMessage("");
        }
      })
      .catch((error) => {
        setErrorMessage("No Matching Criteria.");
        console.error("Error fetching events:", error);
      });

    // Fetch venues for dropdown selection during editing
    fetch("/api/venues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error("Error fetching venues:", error));

    // Fetch artists for checkbox selection
    fetch("/api/artists")
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error("Error fetching artists:", error));
  }, [searchTerm]);

  // Handle the edit button click to edit an event
  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setEditFormData({
      name: event.name,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      location: event.location,
      description: event.description,
      venue_id: event.venue.id,
      event_type: event.event_type,
      artist_ids: event.artists.map((artist) => artist.id),
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle artist selection
  const handleArtistSelection = (artistId) => {
    setEditFormData((prevState) => {
      const isSelected = prevState.artist_ids.includes(artistId);
      return {
        ...prevState,
        artist_ids: isSelected
          ? prevState.artist_ids.filter((id) => id !== artistId)
          : [...prevState.artist_ids, artistId],
      };
    });
  };

  // Save the updated event data
  const handleSaveClick = (eventId) => {
    const isConfirmed = window.confirm("Please verify the date before saving.");
    if (isConfirmed) {
      if (
        !editFormData.time ||
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(editFormData.time)
      ) {
        alert("Please enter a valid time in HH:MM format.");
        return;
      }

      const updatedFormData = {
        ...editFormData,
        date: editFormData.date, // Use the date as-is
        time: editFormData.time,
        user_id: user.user_id // This should not be null or undefined

      };

      fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
        credentials: "include", // Ensures session cookies are included

      })
        .then((response) => response.json())
        .then((updatedEvent) => {
          setEvents(
            events.map((event) => (event.id === eventId ? updatedEvent : event))
          );
          setEditingEventId(null);
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
    fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => {
        setEvents(events.filter((event) => event.id !== eventId));
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  // Load more events when the button is clicked
  const loadMoreEvents = () => {
    setDisplayLimit((prevLimit) => prevLimit + 5); // Increase limit by 5
  };

  // Filter artists based on search input
  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase())
  );

  // Filter venues based on search input
  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase())
  );

  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      {(isAdmin || user?.user_type === 'artist' || user?.user_type === 'venue') && (
      <button
        className="CreateButton"
        onClick={() => navigate("/create-event")}
      >
        Create  Event
      </button>
      )}
      <input
        className="searchme"
        type="text"
        placeholder="[Search by Event Name, Location or Venue]"
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
      <div class="table-container">
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
              <th>Artists</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(0, displayLimit).map((event) => (
              <tr key={event.id}>
                {editingEventId === event.id ? (
                  <>
                    <td>{event.id}</td>
                    <td>
                      <input
                        className="inputedit"
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        className="inputedit"
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        className="inputedit"
                        type="time"
                        name="time"
                        value={editFormData.time}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        className="inputedit"
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        className="inputedit"
                        type="text"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      {/* Search input for venues */}
                      <input
                        className="searcheventsedit"
                        type="text"
                        placeholder="Search Venues..."
                        value={venueSearchTerm}
                        onChange={(e) => setVenueSearchTerm(e.target.value)}
                      />
                      <select
                        className="selectedit"
                        name="venue_id"
                        value={editFormData.venue_id}
                        onChange={handleEditChange}
                      >
                        <option value="" disabled>
                          Select Venue
                        </option>
                        {filteredVenues.map((venue) => (
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
                        <option value="" disabled>
                          Select Event Type
                        </option>
                        <option value="Drag Shows">Drag Shows</option>
                        <option value="Live Lip Syncing">
                          Live Lip Syncing
                        </option>
                        <option value="Live Singing">Live Singing</option>
                        <option value="Comedy Nights">Comedy Nights</option>
                        <option value="Open Mic">Open Mic</option>
                        <option value="Karaoke">Karaoke</option>
                        <option value="DJ Sets">DJ Sets</option>
                        <option value="Dance Performances">
                          Dance Performances
                        </option>
                        <option value="Themed Parties">Themed Parties</option>
                        <option value="Fundraising Events">
                          Fundraising Events
                        </option>
                        <option value="Talent Show">Talent Show</option>
                        <option value="Variety Show">Variety Show</option>
                        <option value="Music Festival">Music Festival</option>
                        <option value="Art Exhibitions">Art Exhibitions</option>
                        <option value="Spoken Word Performances">
                          Spoken Word Performances
                        </option>
                        <option value="Fashion Shows">Fashion Shows</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="searcheventsedit"
                        type="text"
                        placeholder="Search Artists..."
                        value={artistSearchTerm}
                        onChange={(e) => setArtistSearchTerm(e.target.value)}
                      />
                      <div
                        className="event-checkboxes"
                        style={{
                          maxHeight: "150px",
                          overflowY: "scroll",
                          border: "1px solid #ccc",
                          padding: "5px",
                          fontSize: "20px"
                        }}
                      >
                        {filteredArtists.map((artist) => (
                          <div key={artist.id}>
                            <label>
                              <input
                                type="checkbox"
                                value={artist.id}
                                checked={editFormData.artist_ids.includes(
                                  artist.id
                                )}
                                onChange={() =>
                                  handleArtistSelection(artist.id)
                                }
                              />
                              {artist.name}
                            </label>
                          </div>
                        ))}
                      </div>
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
                    <td data-label="ID:">{event.id}</td>
                    <td data-label="Name:">{event.name}</td>
                    <td data-label="Date:">{formatDateString(event.date)}</td>
                    <td data-label="Time:">{formatTimeTo12Hour(event.time)}</td>
                    <td data-label="Location:">{event.location}</td>
                    <td data-label="Description:">{event.description}</td>
                    <td data-label="Venue Name:">{event.venue.name}</td>
                    <td data-label="Event Type:">{event.event_type}</td>
                    <td data-label="Artists Performing:">
                      {event.artists.map((artist) => artist.name).join(", ")}
                    </td>
                    <td>
                    {(isAdmin || event.created_by?.id === user?.user_id) && (
                      <>

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
                      </>
                    )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Load More button */}
        {displayLimit < events.length && (
          <button onClick={loadMoreEvents} className="load-more-button">
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default EventList;
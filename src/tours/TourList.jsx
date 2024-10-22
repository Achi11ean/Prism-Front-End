import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TourList.css"; // Import your CSS file

function TourList() {
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventSearchTerm, setEventSearchTerm] = useState(""); // For searching events
  const [venueSearchTerm, setVenueSearchTerm] = useState(""); // For searching venues
  const [artistSearchTerm, setArtistSearchTerm] = useState(""); // For searching artists
  const [editingTourId, setEditingTourId] = useState(null); // Track the tour being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    social_media_handles: "",
    event_ids: [], // For linking to events
    created_by_id: null, // For venue
    created_by_artist_id: null, // For artist
  });
  const [events, setEvents] = useState([]); // For holding events
  const [venues, setVenues] = useState([]); // For holding venues
  const [artists, setArtists] = useState([]); // For holding artists
  const [errorMessage, setErrorMessage] = useState("");
  const [originalFormData, setOriginalFormData] = useState(null);

  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };
  
  
  // Fetch tours, events, venues, and artists from the backend
  useEffect(() => {
    const url = searchTerm
      ? `https://phase4project-xp0u.onrender.com/tours/search?name=${searchTerm}`
      : "https://phase4project-xp0u.onrender.com/tours";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tours");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setErrorMessage("No tours found matching your search.");
        } else {
          setErrorMessage(""); // Clear error message if tours are found
          setTours(data); // Update the tours list
        }
      })
      .catch((error) => {
        setErrorMessage("No Matching Criteria.");
        console.error("Error fetching tours:", error);
      });

    // Fetch available events for selection
    fetch("https://phase4project-xp0u.onrender.com/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    // Fetch venues and artists
    fetch("https://phase4project-xp0u.onrender.com/venues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error("Error fetching venues:", error));

    fetch("https://phase4project-xp0u.onrender.com/artists")
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error("Error fetching artists:", error));
  }, [searchTerm]);

  // Handle the edit button click to edit a tour
  const handleEditClick = (tour) => {
    // Extract the original event and creator data
    const originalEventIds = tour.events ? tour.events.map((event) => event.id) : [];
    const originalCreatedById = tour.created_by_id || null;
    const originalCreatedByArtistId = tour.created_by_artist_id || null;
  
    // Save the original form data for potential rollback or comparison
    setOriginalFormData({
      name: tour.name,
      start_date: tour.start_date,
      end_date: tour.end_date,
      description: tour.description,
      social_media_handles: tour.social_media_handles,
      event_ids: originalEventIds,
      created_by_id: originalCreatedById,
      created_by_artist_id: originalCreatedByArtistId,
    });
  
    // Populate the edit form data with the same original tour data for editing purposes
    setEditFormData({
      name: tour.name,
      start_date: new Date(tour.start_date).toISOString().split('T')[0],
      end_date: new Date(tour.end_date).toISOString().split('T')[0],
      description: tour.description,
      social_media_handles: tour.social_media_handles,
      event_ids: originalEventIds, // Prepopulate with original event IDs
      created_by_id: originalCreatedById, // Prepopulate with original venue ID
      created_by_artist_id: originalCreatedByArtistId, // Prepopulate with original artist ID
    });
  
    // Set the editing tour ID to track the tour being edited
    setEditingTourId(tour.id);
  };
  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
  
    // Ensure only one creator is selected
    if (name === "created_by_id" || name === "created_by_artist_id") {
      newValue = value ? Number(value) : null;
    }
  
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
      ...(name === "created_by_id" && newValue ? { created_by_artist_id: null } : {}),
      ...(name === "created_by_artist_id" && newValue ? { created_by_id: null } : {}),
    }));
  };

  // Save the updated tour data
// Save the updated tour data
const handleSaveClick = (tourId) => {
  // Convert event_ids to numbers and filter out NaN
  const updatedEventIds = editFormData.event_ids
    .map(Number)
    .filter((id) => !isNaN(id));

      // Format the dates as 'mm/dd/yyyy'
  const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };
  const updatedFormData = {
    name: editFormData.name,
    start_date: formatDateForBackend(editFormData.start_date),  // Format date
    end_date: formatDateForBackend(editFormData.end_date), 
    description: editFormData.description,
    social_media_handles: editFormData.social_media_handles,
    event_ids: updatedEventIds,
    created_by_id: editFormData.created_by_id,
    created_by_artist_id: editFormData.created_by_artist_id,
  };

  // Ask for confirmation
  const confirmMessage = `Are you sure you want to update the tour with the following details?\n\n` +
                         `Name: ${updatedFormData.name}\n` +
                         `Start Date: ${updatedFormData.start_date}\n` +
                         `End Date: ${updatedFormData.end_date}\n` +
                         `Description: ${updatedFormData.description}\n` +
                         `Social Media Handles: ${updatedFormData.social_media_handles}\n` +
                         `Events: ${updatedFormData.event_ids.join(", ")}`;

  if (window.confirm(confirmMessage)) {
    console.log("Updating tour:", updatedFormData);

    fetch(`https://phase4project-xp0u.onrender.com/tours/${tourId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              errorData.message || "Failed to update tour due to server error."
            );
          });
        }
        return response.json();
      })
      .then((updatedTour) => {
        console.log("Updated tour response:", updatedTour);
        setTours(
          tours.map((tour) => (tour.id === tourId ? updatedTour : tour))
        );
        setEditingTourId(null);
      })
      .catch((error) => {
        console.error("Error updating tour:", error);
        alert("Failed to update tour: " + error.message);
      });
  } else {
    console.log("Update canceled by user.");
  }
};

  // Handle canceling the edit
  const handleCancelClick = () => {
    setEditingTourId(null);
  };

  

  // Handle deleting a tour
  const handleDeleteClick = (tourId) => {
    fetch(`https://phase4project-xp0u.onrender.com/tours/${tourId}`, {
      method: "DELETE",
    })
      .then(() => {
        setTours(tours.filter((tour) => tour.id !== tourId));
      })
      .catch((error) => console.error("Error deleting tour:", error));
  };

  const handleEventSelection = (eventId) => {
    const numericEventId = Number(eventId);
    if (isNaN(numericEventId)) {
      console.error('Invalid event ID:', eventId);
      return; // Exit the function if the eventId is not a valid number
    }
  
    setEditFormData((prevState) => {
      const isSelected = prevState.event_ids.includes(numericEventId);
      return {
        ...prevState,
        event_ids: isSelected
          ? prevState.event_ids.filter((id) => id !== numericEventId)
          : [...prevState.event_ids, numericEventId],
      };
    });
  };
  
  

  return (
    <div className="tour-list-container">
      <h2>Tour List</h2>
      {/* Create button */}
      <button className="CreateTour" onClick={() => navigate("/create-tour")}>
        Create Tour
      </button>
      {/* Search input */}
      <input
        className="search-input"
        type="text"
        placeholder="Search by tour name, artist, or venue"
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
      <div className="table-container">

      <table border="1" cellPadding="10" className="tour-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Description</th>
            <th>Socials</th>
            <th>Events</th> {/* New column for Events */}
            <th>Creator</th> {/* New column for Created By */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id}>
              {editingTourId === tour.id ? (
                <>
                  <td>{tour.id}</td>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="date"
                      name="start_date"
                      value={editFormData.start_date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="date"
                      name="end_date"
                      value={editFormData.end_date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      name="social_media_handles"
                      value={editFormData.social_media_handles}
                      onChange={handleEditChange}
                      placeholder="e.g. twitter.com/yourhandle"
                    />
                  </td>
                  <td>
                    <input
                      className="searchedit"
                      type="text"
                      placeholder="Search Events"
                      value={eventSearchTerm}
                      onChange={(e) => setEventSearchTerm(e.target.value)}
                    />
                    <div
                      className="event-checkboxes"
                      style={{
                        maxHeight: "150px",
                        overflowY: "scroll",
                        border: "1px solid #ccc",
                        padding: "5px",
                      }}
                    >
                      {events
                        .filter(event =>
                          event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
                        )
                        .map((event) => (
                          <div key={event.id}>
                            <label>
                              <input
                                type="checkbox"
                                value={event.id}
                                checked={editFormData.event_ids.includes(Number(event.id))}
                                onChange={() => handleEventSelection(event.id)}
                              />
                              {event.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  </td>


                  <td>
                    {/* Search input for venues */}
                    <input
                      placeholder="Search Venues..."
                      type="text"
                      value={venueSearchTerm}
                      onChange={(e) => setVenueSearchTerm(e.target.value)}
                      className="searchedit"
                    />
                    {/* Select for Venue */}
                    <select
                      className="SelectArtist"
                      name="created_by_id"
                      value={editFormData.created_by_id || ""}
                      onChange={handleEditChange}
                    >
                      <option value="">Venues</option>
                      {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
                    <br />
                    {/* Search input for artists */}
                    <input
                      type="text"
                      placeholder="Search Artists..."
                      value={artistSearchTerm}
                      onChange={(e) => setArtistSearchTerm(e.target.value)}
                      className="searchedit"
                    />
                    {/* Select for Artist */}
                    <select
                      className="SelectArtist"
                      name="created_by_artist_id"
                      value={editFormData.created_by_artist_id || ""}
                      onChange={handleEditChange}
                    >
                      <option value="">Artists</option>
                      {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                          {artist.name}
                        </option>
                      ))}
                    </select>
                  </td>


                  <td>
                    <button
                      className="Saveme"
                      onClick={() => handleSaveClick(tour.id)}
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
                  <td data-label="ID:">{tour.id}</td>
                  <td data-label="Name:">{tour.name}</td>
                  <td data-label="Start Date:">{formatDate(tour.start_date)}</td>
                  <td data-label="End Date:">{formatDate(tour.end_date)}</td>
                  <td data-label="Description:">{tour.description}</td>
                  <td data-label="Handles:">{tour.social_media_handles}</td>
                  <td data-label="Events:">
                    {tour.events
                      ? tour.events.map((event) => event.name).join(", ")
                      : "No Events"}
                  </td>
                  <td data-label="Creator:">
                    {tour.created_by ? tour.created_by : tour.created_by_artist}
                  </td> {/* Show either venue or artist name */}
                  <td data-label="Action Buttons:">
                    <button
                      className="editbutton"
                      onClick={() => handleEditClick(tour)}
                    >
                      Edit
                    </button>
                    <button
                      className="deletebutton"
                      onClick={() => handleDeleteClick(tour.id)}
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
    </div>
  );
}

export default TourList;
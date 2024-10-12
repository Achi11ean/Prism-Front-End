import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ArtistList.css"; // Import your CSS file

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingArtistId, setEditingArtistId] = useState(null); // Track the artist being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    age: "",
    background: "",
    songs: "",
    event_ids: [], // For linking to events
  });
  const [events, setEvents] = useState([]); // For holding events
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Fetch artists and events from the backend
  useEffect(() => {
    const url = searchTerm
      ? `http://127.0.0.1:5001/artists/search?name=${searchTerm}`
      : "http://127.0.0.1:5001/artists";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch artists");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setErrorMessage("No artists found matching your search.");
        } else {
          setErrorMessage(""); // Clear error message if artists are found
          setArtists(data); // Update the artists list
        }
      })
      .catch((error) => {
        setErrorMessage("No Matching Criteria.");
        console.error("Error fetching artists:", error);
      });

    // Fetch available events for selection
    fetch("http://127.0.0.1:5001/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, [searchTerm]);

  // Handle the edit button click to edit an artist
  const handleEditClick = (artist) => {
    setEditingArtistId(artist.id);
    setEditFormData({
      name: artist.name,
      age: artist.age,
      background: artist.background,
      songs: artist.songs.join(", "), // Assuming songs is an array
      event_ids: artist.event_ids || [], // Link associated events
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle multiple event selection during editing
  const handleEventChange = (e) => {
    const options = e.target.options;
    const selectedEvents = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedEvents.push(options[i].value);
      }
    }
    setEditFormData({ ...editFormData, event_ids: selectedEvents });
  };

  // Save the updated artist data
  const handleSaveClick = (artistId) => {
    const updatedFormData = {
      name: editFormData.name,
      age: editFormData.age,
      background: editFormData.background,
      songs: editFormData.songs.split(",").map((song) => song.trim()).join(","), // Convert array to string
      event_ids: editFormData.event_ids.map(Number), // Convert to numbers
    };

    fetch(`http://127.0.0.1:5001/artists/${artistId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData), // Send the updated form data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update artist");
        }
        return response.json();
      })
      .then((updatedArtist) => {
        setArtists(
          artists.map((artist) => (artist.id === artistId ? updatedArtist : artist))
        );
        setEditingArtistId(null); // Exit editing mode
      })
      .catch((error) => {
        console.error("Error updating artist:", error);
        alert("Failed to update artist");
      });
  };

  // Handle canceling the edit
  const handleCancelClick = () => {
    setEditingArtistId(null);
  };

  // Handle deleting an artist
  const handleDeleteClick = (artistId) => {
    fetch(`http://127.0.0.1:5001/artists/${artistId}`, {
      method: "DELETE",
    })
      .then(() => {
        setArtists(artists.filter((artist) => artist.id !== artistId));
      })
      .catch((error) => console.error("Error deleting artist:", error));
  };

  return (
    <div className="artist-list-container">
      <h2>Artist List</h2>
      {/* Create button */}
      <button className="Create" onClick={() => navigate("/create-artist")}>
        Create New Artist
      </button>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by artist name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {errorMessage && (
        <p className="error-message" style={{ color: "black", fontSize: "2em", backgroundColor: "white" }}>
          {errorMessage}
        </p>
      )}
      <table border="1" cellPadding="10" className="artist-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Background</th>
            <th>Songs</th>
            <th>Events</th> {/* New column for Events */}
            <th>Favorited By</th> {/* New column for Favorited By */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              {editingArtistId === artist.id ? (
                <>
                  <td>{artist.id}</td>
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
                      type="number"
                      name="age"
                      value={editFormData.age}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="background"
                      value={editFormData.background}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="songs"
                      value={editFormData.songs}
                      onChange={handleEditChange}
                      placeholder="e.g. Song1, Song2"
                    />
                  </td>
                  <td>
                    <select  
                      className="selecteventtypes"
                      name="event_ids"
                      multiple
                      value={editFormData.event_ids}
                      onChange={handleEventChange}
                    >
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="Saveme"onClick={() => handleSaveClick(artist.id)}>Save</button>
                    <button className="Cancelme" onClick={handleCancelClick}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{artist.id}</td>
                  <td>{artist.name}</td>
                  <td>{artist.age}</td>
                  <td>{artist.background}</td>
                  <td>{artist.songs.join(", ")}</td>
                  <td>{artist.events ? artist.events.map(event => event.name).join(", ") : 'No Events'}</td>
                  <td>{artist.favorited_by.length > 0 ? artist.favorited_by.map(attendee => attendee.name).join(", ") : 'No Favorites'}</td> {/* List of attendees who favorited the artist */}
                  <td>
                    <button className="editbutton" onClick={() => handleEditClick(artist)}>Edit</button>
                    <button className="deletebutton" onClick={() => handleDeleteClick(artist.id)}>Delete</button>
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

export default ArtistList;
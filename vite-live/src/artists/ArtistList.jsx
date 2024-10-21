import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ArtistList.css"; // Import your CSS file

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventSearchTerm, setEventSearchTerm] = useState(""); // For searching events
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
  const [displayLimit, setDisplayLimit] = useState(5); // Limit number of artists displayed by default

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
      event_ids: artist.events ? artist.events.map(event => event.id) : [], // Extract event IDs from the events array
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Save the updated artist data
  const handleSaveClick = (artistId) => {
    const updatedFormData = {
      name: editFormData.name,
      age: editFormData.age,
      background: editFormData.background,
      songs: editFormData.songs
        .split(",")
        .map((song) => song.trim())
        .join(","), // Convert array to string
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
          artists.map((artist) =>
            artist.id === artistId ? updatedArtist : artist
          )
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

  // Load more artists when the button is clicked
  const loadMoreArtists = () => {
    setDisplayLimit((prevLimit) => prevLimit + 5); // Increase limit by 5
  };

  const renderSongs = (songs) => {
    return songs.split(",").map((song, index) => {
      const parts = song.split(" ");
      return (
        <span key={index}>
          {parts.map((part, i) =>
            part.startsWith("https://") ? (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
            ) : (
              <span key={i}>{part} </span>
            )
          )}
          {index < songs.length - 1 && ", "}
        </span>
      );
    });
  };

  return (
    <div className="artist-list-container">
      <h2>Artist List</h2>
      {/* Create button */}
      <button className="Create" onClick={() => navigate("/create-artist")}>
        Create Artist
      </button>
      {/* Search input */}
      <input
        className="searchartists"
        type="text"
        placeholder="Search by artist name"
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
            {artists.slice(0, displayLimit).map((artist) => (  // Limit artists displayed by displayLimit
              <tr key={artist.id}>
                {editingArtistId === artist.id ? (
                  <>
                    <td>{artist.id}</td>
                    <td>
                      <input
                        className="inputartists"
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        className="inputartists"
                        type="number"
                        name="age"
                        value={editFormData.age}
                        onChange={handleEditChange}
                        min="18"
                        max="100"
                      />
                    </td>
                    <td>
                      <textarea
                        className="limit inputartists"
                        name="background"
                        value={editFormData.background}
                        onChange={handleEditChange}
                        placeholder="Enter background information"
                        rows="4"
                        maxLength={500}
                      />
                    </td>
                    <td>
                      <textarea
                        className="limit inputartists"
                        name="songs"
                        value={editFormData.songs}
                        onChange={handleEditChange}
                        placeholder="e.g. Song1: https://example.com, Song2: https://example.com"
                        rows="4"
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
                        style={{ maxHeight: "150px", overflowY: "auto" }}
                      >
                        {events
                          .filter((event) =>
                            event.name
                              .toLowerCase()
                              .includes(eventSearchTerm.toLowerCase())
                          )
                          .map((event) => (
                            <div key={event.id}>
                              <input
                                type="checkbox"
                                id={`event-${event.id}`}
                                value={event.id}
                                checked={editFormData.event_ids.includes(
                                  event.id
                                )}
                                onChange={(e) => {
                                  const selectedEventId = parseInt(
                                    e.target.value
                                  );
                                  const updatedEventIds =
                                    editFormData.event_ids.includes(
                                      selectedEventId
                                    )
                                      ? editFormData.event_ids.filter(
                                          (id) => id !== selectedEventId
                                        ) // Uncheck the box
                                      : [
                                          ...editFormData.event_ids,
                                          selectedEventId,
                                        ]; // Check the box

                                  setEditFormData({
                                    ...editFormData,
                                    event_ids: updatedEventIds,
                                  });
                                }}
                              />
                              <label htmlFor={`event-${event.id}`}>
                                {event.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </td>
                    <td>
                      <button className="Saveme" onClick={() => handleSaveClick(artist.id)}>
                        Save
                      </button>
                      <button className="Cancelme" onClick={handleCancelClick}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{artist.id}</td>
                    <td>{artist.name}</td>
                    <td>{artist.age}</td>
                    <td>{artist.background}</td>
                    <td>{renderSongs(artist.songs.join(", "))}</td>
                    <td>
                      {artist.events
                        ? artist.events.map((event) => event.name).join(", ")
                        : "No Events"}
                    </td>
                    <td>
                      {artist.favorited_by.length > 0
                        ? artist.favorited_by
                            .map((attendee) => attendee.name)
                            .join(", ")
                        : "No Favorites"}
                    </td>
                    <td>
                      <button
                        className="editbutton"
                        onClick={() => handleEditClick(artist)}
                      >
                        Edit
                      </button>
                      <button
                        className="deletebutton"
                        onClick={() => handleDeleteClick(artist.id)}
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

        {/* Load More button */}
        {displayLimit < artists.length && (
          <button onClick={loadMoreArtists} className="load-more-button">Load More</button>
        )}
      </div>
    </div>
  );
}

export default ArtistList;
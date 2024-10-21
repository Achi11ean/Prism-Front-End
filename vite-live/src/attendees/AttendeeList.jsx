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
    social_media: "", // Add social media field here
  });

  const [searchTerm, setSearchTerm] = useState(""); // For attendee search
  const [eventSearchTerm, setEventSearchTerm] = useState(""); // For favorite events search
  const [artistSearchTerm, setArtistSearchTerm] = useState(""); // For favorite artists search
  const [artists, setArtists] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(5); // Limit number of attendees displayed by default

  const navigate = useNavigate();

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
        console.log("Fetched attendees:", data); // Debugging log
        if (Array.isArray(data)) {
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
      social_media: attendee.social_media || "", // Add social media field here
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

  const handleSocialMediaChange = (e) => {
    const { value } = e.target;
  
    // Split by commas to get each social media entry, then split by colon to get platform and URL
    const socialMediaArray = value.split(",").map((entry) => {
      const [platform, url] = entry.split(":").map(part => part.trim());
      return { platform, url };
    });
  
    // Update editData with the structured array of social media entries
    setEditData({ ...editData, social_media: socialMediaArray });
  };

  const renderSocialMediaLinks = (socialMediaArray) => {
    return socialMediaArray.map((entry, index) => {
      return (
        <span key={index}>
          <strong>{entry.platform}</strong>:{" "}
          <a href={entry.url} target="_blank" rel="noopener noreferrer">
            {entry.url}
          </a>
          {index < socialMediaArray.length - 1 && ", "}
        </span>
      );
    });
  };

  const handleSave = (id) => {
    const updatedAttendee = {
      first_name: editData.first_name,
      last_name: editData.last_name,
      email: editData.email,
      favorite_event_ids: editData.favorite_event_ids,
      favorite_event_types: editData.favorite_event_types,
      favorite_artist_ids: editData.favorite_artist_ids,
      social_media: editData.social_media, // Include social media here
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
          return response.json().then((errorData) => {
            console.error("Error response from server:", errorData);
            throw new Error("Failed to save attendee");
          });
        }
        return response.json();
      })
      .then((data) => {
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
    setSearchTerm(e.target.value);
  };

  const handleEventSearchChange = (e) => {
    setEventSearchTerm(e.target.value);
  };

  const handleArtistSearchChange = (e) => {
    setArtistSearchTerm(e.target.value);
  };

  // Load more attendees when the button is clicked
  const loadMoreAttendees = () => {
    setDisplayLimit((prevLimit) => prevLimit + 5); // Increase limit by 5
  };

  if (loading) {
    return <p>Loading attendees...</p>;
  }

  // Filter events based on the event search term
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
  );

  // Filter artists based on the artist search term
  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase())
  );

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
        Create Attendee
      </button>
      {attendees.length === 0 ? (
        <p id="error">No Matching Criteria.</p>
      ) : (
        <div className="table-container">
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
                <th>Social Media</th> {/* Add Social Media column here */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendees.slice(0, displayLimit).map((attendee) => (
                <tr key={attendee.id}>
                  <td>{attendee.id}</td>
                  <td>
                    {editingId === attendee.id ? (
                      <input
                        className="editattendee"
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
                        className="editattendee"
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
                        className="editattendee"
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      attendee.email
                    )}
                  </td>

                  <td className="favorite-event-column">
                    {editingId === attendee.id ? (
                      <>
                        {/* Search bar for favorite events */}
                        <input
                          className="editattendee"
                          type="text"
                          placeholder="Search favorite events..."
                          value={eventSearchTerm}
                          onChange={handleEventSearchChange}
                        />
                        <div
                          className="event-checkboxes"
                          style={{
                            maxHeight: "150px",
                            overflowY: "scroll",
                            border: "1px solid #ccc",
                            padding: "5px",
                            fontSize: "20px",
                            width: "200px"
                          }}
                        >
                          {filteredEvents.map((event) => (
                            <div key={event.id}>
                              <label>
                                <input
                                  type="checkbox"
                                  value={event.id}
                                  checked={editData.favorite_event_ids.includes(
                                    event.id
                                  )}
                                  onChange={handleEventSelection}
                                />
                                {event.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
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
                      <>
                        {/* Search bar for favorite event types */}
                        <input
                          className="editattendee"
                          type="text"
                          placeholder="Search favorite event types..."
                          value={eventSearchTerm}
                          onChange={handleEventSearchChange}
                        />
                        <div
                          className="event-checkboxes"
                          style={{
                            maxHeight: "150px",
                            overflowY: "scroll",
                            border: "1px solid #ccc",
                            padding: "5px",
                            fontSize: "20px",
                            width: "200px"
                          }}
                        >
                          {eventTypes.map((eventType) => (
                            <div key={eventType}>
                              <label>
                                <input
                                  type="checkbox"
                                  value={eventType}
                                  checked={editData.favorite_event_types.includes(
                                    eventType
                                  )}
                                  onChange={handleEventTypeSelection}
                                />
                                {eventType}
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
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
                      <>
                        {/* Search bar for favorite artists */}
                        <input
                          className="editattendee"
                          type="text"
                          placeholder="Search favorite artists..."
                          value={artistSearchTerm}
                          onChange={handleArtistSearchChange}
                        />
                        <div
                          className="event-checkboxes"
                          style={{
                            maxHeight: "150px",
                            overflowY: "scroll",
                            border: "1px solid #ccc",
                            padding: "5px",
                            fontSize: "20px",
                            width: "200px"
                          }}
                        >
                          {filteredArtists.map((artist) => (
                            <div key={artist.id}>
                              <label>
                                <input
                                  type="checkbox"
                                  value={artist.id}
                                  checked={editData.favorite_artist_ids.includes(
                                    artist.id
                                  )}
                                  onChange={handleArtistSelection}
                                />
                                {artist.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
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
                      <input
                        className="editattendee"
                        type="text"
                        name="social_media"
                        value={editData.social_media}
                        onChange={handleInputChange}
                        placeholder="Enter social media URL"
                      />
                    ) : (
                      attendee.social_media || "No social media provided"
                    )}
                  </td>
                  <td>
                    {editingId === attendee.id ? (
                      <>
                        <button
                          className="Saveme"
                          onClick={() => handleSave(attendee.id)}
                        >
                          Save
                        </button>
                        <button className="Cancelme" onClick={handleCancel}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="editbutton"
                          onClick={() => handleEdit(attendee)}
                        >
                          Edit
                        </button>
                        <button
                          className="deletebutton"
                          onClick={() => handleDelete(attendee.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Load More button */}
          {displayLimit < attendees.length && (
            <button onClick={loadMoreAttendees} className="load-more-button">
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendeeList;

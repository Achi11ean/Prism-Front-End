// AttendeeList.jsx
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
    social_media: [],
    favorite_venues: [],
  });

  const [searchTerm, setSearchTerm] = useState(""); // For attendee search
  const [eventSearchTerm, setEventSearchTerm] = useState(""); // For favorite events search
  const [artistSearchTerm, setArtistSearchTerm] = useState(""); // For favorite artists search
  const [artists, setArtists] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(5); // Limit number of attendees displayed by default
  const [eventTypeSearchTerm, setEventTypeSearchTerm] = useState(""); // New state for event types search
  const [venues, setVenues] = useState([]);
  const [venueSearchTerm, setVenueSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://phase4project-xp0u.onrender.com/venues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error("Error fetching venues:", error));
  }, []);

  useEffect(() => {
    // Fetch artists
    fetch("https://phase4project-xp0u.onrender.com/artists")
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
      ? `https://phase4project-xp0u.onrender.com/attendees/search?name=${searchTerm}`
      : "https://phase4project-xp0u.onrender.com/attendees";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched attendees:", data); // Debugging log

        // Process data to ensure attendee.social_media is always an array
        const processedData = data.map((attendee) => {
          let social_media = attendee.social_media;

          if (Array.isArray(social_media)) {
            // Already an array, do nothing
          } else if (typeof social_media === "object" && social_media !== null) {
            // Convert object to array of { platform, handle }
            social_media = Object.entries(social_media).map(([platform, handle]) => ({
              platform,
              handle,
            }));
          } else if (typeof social_media === "string") {
            // Convert string to array with one element
            social_media = [{ platform: "", handle: social_media }];
          } else {
            // Set to empty array if undefined or null
            social_media = [];
          }

          return {
            ...attendee,
            social_media,
          };
        });

        if (Array.isArray(processedData)) {
          setAttendees(processedData);
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

    fetch("https://phase4project-xp0u.onrender.com/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    fetch("https://phase4project-xp0u.onrender.com/event-types")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched event types:", data); // Debugging log
        setEventTypes(data);
      })
      .catch((error) => console.error("Error fetching event types:", error));
  }, [searchTerm]);

  const handleDelete = (id) => {
    fetch(`https://phase4project-xp0u.onrender.com/attendees/${id}`, {
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
      favorite_event_ids: prevState.favorite_event_ids.includes(
        selectedEventId
      )
        ? prevState.favorite_event_ids.filter((id) => id !== selectedEventId)
        : [...prevState.favorite_event_ids, selectedEventId],
    }));
  };

  const handleVenueSelection = (venueId) => {
    venueId = Number(venueId); // Ensure venueId is a number
    setEditData((prevState) => {
      const exists = prevState.favorite_venues.some(
        (fv) => fv.venue_id === venueId
      );
      if (exists) {
        // Remove venue
        return {
          ...prevState,
          favorite_venues: prevState.favorite_venues.filter(
            (fv) => fv.venue_id !== venueId
          ),
        };
      } else {
        // Add venue with default rating
        return {
          ...prevState,
          favorite_venues: [
            ...prevState.favorite_venues,
            { venue_id: venueId, rating: 1 },
          ],
        };
      }
    });
  };

  const handleVenueRatingChange = (venueId, rating) => {
    setEditData((prevState) => ({
      ...prevState,
      favorite_venues: prevState.favorite_venues.map((fv) =>
        fv.venue_id === venueId ? { ...fv, rating: parseInt(rating) } : fv
      ),
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
      favorite_venues: attendee.venues
        ? attendee.venues.map((venue) => ({
            venue_id: venue.venue_id || venue.id,
            rating: venue.rating || 1,
          }))
        : [],
      social_media: Array.isArray(attendee.social_media)
        ? attendee.social_media
        : typeof attendee.social_media === "object"
        ? Object.entries(attendee.social_media).map(([platform, handle]) => ({
            platform,
            handle,
          }))
        : attendee.social_media
        ? [{ platform: "", handle: attendee.social_media }]
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

  const handleSocialMediaChange = (index, field, value) => {
    setEditData((prevState) => {
      const social_media = [...prevState.social_media];
      social_media[index][field] = value;
      return { ...prevState, social_media };
    });
  };

  const addSocialMediaEntry = () => {
    setEditData((prevState) => ({
      ...prevState,
      social_media: [...prevState.social_media, { platform: "", handle: "" }],
    }));
  };

  const removeSocialMediaEntry = (index) => {
    setEditData((prevState) => {
      const social_media = [...prevState.social_media];
      social_media.splice(index, 1);
      return { ...prevState, social_media };
    });
  };

  const renderSocialMediaLinks = (socialMedia) => {
    console.log("socialMedia:", socialMedia); // Debugging log
    if (!socialMedia || socialMedia.length === 0) {
      return "No social media provided";
    }

    if (Array.isArray(socialMedia)) {
      return (
        <ul>
          {socialMedia.map((entry, index) => (
            <li key={index}>
              <strong>{entry.platform}:</strong> {entry.handle}
            </li>
          ))}
        </ul>
      );
    } else if (typeof socialMedia === "object" && socialMedia !== null) {
      return (
        <ul>
          {Object.entries(socialMedia).map(([platform, handle], index) => (
            <li key={index}>
              <strong>{platform}:</strong> {handle}
            </li>
          ))}
        </ul>
      );
    } else if (typeof socialMedia === "string") {
      return socialMedia;
    } else {
      return "No social media provided";
    }
  };

  const handleSave = (id) => {
    const socialMediaObject = editData.social_media.reduce((acc, entry) => {
      if (entry.platform && entry.handle) {
        acc[entry.platform] = entry.handle;
      }
      return acc;
    }, {});

    // Adjust favorite_venues to match backend expectations
    const favoriteVenues = editData.favorite_venues.map((fv) => ({
      venue_id: fv.venue_id, // Use 'venue_id' if backend expects that
      rating: fv.rating,
    }));

    const updatedAttendee = {
      first_name: editData.first_name,
      last_name: editData.last_name,
      email: editData.email,
      favorite_event_ids: editData.favorite_event_ids,
      favorite_event_types: editData.favorite_event_types,
      favorite_artist_ids: editData.favorite_artist_ids,
      social_media: socialMediaObject,
      favorite_venues: favoriteVenues, // Use the adjusted favorite venues
    };

    console.log("Data sent to backend:", JSON.stringify(updatedAttendee, null, 2));

    fetch(`https://phase4project-xp0u.onrender.com/attendees/${id}`, {
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
                <th>Favorite Venues</th>
                <th>Social Media</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendees.slice(0, displayLimit).map((attendee) => (
                <tr key={attendee.id}>
                  <td data-label="ID:">{attendee.id}</td>
                  <td data-label="First Name:">
                    {editingId === attendee.id ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="first_name"
                        value={editData.first_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      attendee.first_name
                    )}
                  </td>
                  <td data-label="Last Name:">
                    {editingId === attendee.id ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="last_name"
                        value={editData.last_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      attendee.last_name
                    )}
                  </td>
                  <td data-label="Email:">
                    {editingId === attendee.id ? (
                      <input
                        className="edit-input"
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      attendee.email
                    )}
                  </td>

                  <td
                    data-label="Favorite Events:"
                    className="favorite-event-column"
                  >
                    {editingId === attendee.id ? (
                      <>
                        {/* Search bar for favorite events */}
                        <input
                          className="edit-input"
                          type="text"
                          placeholder="Search favorite events..."
                          value={eventSearchTerm}
                          onChange={handleEventSearchChange}
                        />
                        <div className="event-checkboxes">
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
                          attendee.favorite_events.slice(0, 2).map((event) => (
                            <li key={event.id}>{event.name}</li>
                          ))
                        ) : (
                          <li>No favorite events</li>
                        )}
                        {attendee.favorite_events &&
                          attendee.favorite_events.length > 2 && (
                            <li>
                              and {attendee.favorite_events.length - 2} more...
                            </li>
                          )}
                      </ul>
                    )}
                  </td>

                  <td data-label="Favorite Event Types:">
                    {editingId === attendee.id ? (
                      <>
                        {/* Search bar for favorite event types */}
                        <input
                          className="edit-input"
                          type="text"
                          placeholder="Search favorite event types..."
                          value={eventTypeSearchTerm} // Use the new state variable
                          onChange={(e) =>
                            setEventTypeSearchTerm(e.target.value)
                          } // Update the correct state
                        />
                        <div className="event-checkboxes">
                          {eventTypes
                            .filter((eventType) =>
                              eventType
                                .toLowerCase()
                                .includes(eventTypeSearchTerm.toLowerCase())
                            )
                            .map((eventType) => (
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
                          attendee.favorite_event_types.slice(0, 2).map((type) => (
                            <li key={type}>{type}</li>
                          ))
                        ) : (
                          <li>No favorite event types</li>
                        )}
                        {attendee.favorite_event_types &&
                          attendee.favorite_event_types.length > 2 && (
                            <li>
                              and {attendee.favorite_event_types.length - 2} more...
                            </li>
                          )}
                      </ul>
                    )}
                  </td>
                  <td data-label="Favorite Artists:">
                    {editingId === attendee.id ? (
                      <>
                        {/* Search bar for favorite artists */}
                        <input
                          className="edit-input"
                          type="text"
                          placeholder="Search favorite artists..."
                          value={artistSearchTerm}
                          onChange={handleArtistSearchChange}
                        />
                        <div className="event-checkboxes">
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
                          attendee.favorite_artists.slice(0, 2).map((artist) => (
                            <li key={artist.id}>{artist.name}</li>
                          ))
                        ) : (
                          <li>No favorite artists</li>
                        )}
                        {attendee.favorite_artists &&
                          attendee.favorite_artists.length > 2 && (
                            <li>
                              and {attendee.favorite_artists.length - 2} more...
                            </li>
                          )}
                      </ul>
                    )}
                  </td>
                  {/* New Venue Ratings Cell */}
                  <td data-label="Favorite Venues:">
                    {editingId === attendee.id ? (
                      <>
                        {/* Search bar for favorite venues */}
                        <input
                          className="edit-input"
                          type="text"
                          placeholder="Search favorite venues..."
                          value={venueSearchTerm}
                          onChange={(e) =>
                            setVenueSearchTerm(e.target.value)
                          }
                        />
                        <div className="event-checkboxes">
                          {venues
                            .filter((venue) =>
                              venue.name
                                .toLowerCase()
                                .includes(venueSearchTerm.toLowerCase())
                            )
                            .map((venue) => (
                              <div key={venue.id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    value={venue.id}
                                    checked={editData.favorite_venues.some(
                                      (fv) => fv.venue_id === venue.id
                                    )}
                                    onChange={() =>
                                      handleVenueSelection(venue.id)
                                    }
                                  />
                                  {venue.name}
                                </label>
                                {/* Rating input for the selected venue */}
                                {editData.favorite_venues.some(
                                  (fv) => fv.venue_id === venue.id
                                ) && (
                                  <div>
                                    <label>
                                      Rating:
                                      <select
                                        value={
                                          editData.favorite_venues.find(
                                            (fv) => fv.venue_id === venue.id
                                          ).rating || 1
                                        }
                                        onChange={(e) =>
                                          handleVenueRatingChange(
                                            venue.id,
                                            e.target.value
                                          )
                                        }
                                      >
                                        {[1, 2, 3, 4, 5].map((val) => (
                                          <option key={val} value={val}>
                                            {val}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </>
                    ) : (
                      <ul>
                        {attendee.venues && attendee.venues.length > 0 ? (
                          attendee.venues.slice(0, 2).map((venue) => (
                            <li key={venue.venue_id || venue.id}>
                              {venue.name}: {venue.rating}
                            </li>
                          ))
                        ) : (
                          <li>No favorite venues</li>
                        )}
                        {attendee.venues && attendee.venues.length > 2 && (
                          <li>
                            and {attendee.venues.length - 2} more...
                          </li>
                        )}
                      </ul>
                    )}
                  </td>

                  <td data-label="Social Media:">
                    {editingId === attendee.id ? (
                      <>
                        {editData.social_media.map((entry, index) => (
                          <div key={index}>
                            <input
                              className="edit-input"
                              type="text"
                              placeholder="Platform"
                              value={entry.platform}
                              onChange={(e) =>
                                handleSocialMediaChange(
                                  index,
                                  "platform",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              className="edit-input"
                              type="text"
                              placeholder="Handle"
                              value={entry.handle}
                              onChange={(e) =>
                                handleSocialMediaChange(
                                  index,
                                  "handle",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="Socials"
                              type="button"
                              onClick={() => removeSocialMediaEntry(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button className="Socials" type="button" onClick={addSocialMediaEntry}>
                          Add Social Media
                        </button>
                      </>
                    ) : (
                      renderSocialMediaLinks(attendee.social_media)
                    )}
                  </td>

                  <td data-label="Actions:">
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
            <button
              onClick={loadMoreAttendees}
              className="load-more-button"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendeeList;

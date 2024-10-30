// CreateAttendee.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAttendee.css"; // Ensure you have this CSS file
import { useAuth } from "../AuthContext"; // Import useAuth to access user data

function CreateAttendee() {
  const { user } = useAuth(); // Retrieve the current user from context
  console.log('USER IN CREATE ATTENDEE IS: ', user)

  const [newAttendee, setNewAttendee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    preferred_event_type: "",
    favorite_event_types: [],
    favorite_artist_ids: [],
    favorite_event_ids: [],
    social_media: [],
    favorite_venues: []
    
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [venueSearchTerm, setVenueSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  // Fetch available event types, artists, events, and venues on component load
  useEffect(() => {
    fetch("https://phase4project-xp0u.onrender.com//event-types")
      .then((response) => response.json())
      .then((data) => setEventTypes(data))
      .catch((error) => console.error("Error fetching event types:", error));

    fetch("https://phase4project-xp0u.onrender.com//artists")
      .then((response) => response.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error("Error fetching artists:", error));

    fetch("https://phase4project-xp0u.onrender.com//events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    fetch("https://phase4project-xp0u.onrender.com//venues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error("Error fetching venues:", error));
  }, []);

  const handleVenueSelection = (venueId) => {
    venueId = Number(venueId); // Ensure venueId is a number
    setNewAttendee((prevState) => {
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
    setNewAttendee((prevState) => ({
      ...prevState,
      favorite_venues: prevState.favorite_venues.map((fv) =>
        fv.venue_id === venueId ? { ...fv, rating: parseInt(rating) } : fv
      ),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee({ ...newAttendee, [name]: value });
  };

  const handleEventTypeSelection = (e) => {
    const selectedEventType = e.target.value;
    setNewAttendee((prevState) => ({
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

  const handleArtistSelection = (artistId) => {
    artistId = Number(artistId); // Ensure artistId is a number
    const currentIndex = newAttendee.favorite_artist_ids.indexOf(artistId);
    const newFavoriteArtists = [...newAttendee.favorite_artist_ids];

    if (currentIndex === -1) {
      newFavoriteArtists.push(artistId);
    } else {
      newFavoriteArtists.splice(currentIndex, 1);
    }

    setNewAttendee({ ...newAttendee, favorite_artist_ids: newFavoriteArtists });
  };

  const handleFavoriteEventSelection = (eventId) => {
    eventId = Number(eventId); // Ensure eventId is a number
    const currentIndex = newAttendee.favorite_event_ids.indexOf(eventId);
    const newFavoriteEvents = [...newAttendee.favorite_event_ids];

    if (currentIndex === -1) {
      newFavoriteEvents.push(eventId);
    } else {
      newFavoriteEvents.splice(currentIndex, 1);
    }

    setNewAttendee({ ...newAttendee, favorite_event_ids: newFavoriteEvents });
  };

  const handleSocialMediaChange = (index, field, value) => {
    const social_media = [...newAttendee.social_media];
    social_media[index][field] = value;
    setNewAttendee({ ...newAttendee, social_media });
  };

  const addSocialMediaEntry = () => {
    setNewAttendee((prevState) => ({
      ...prevState,
      social_media: [...prevState.social_media, { platform: "", handle: "" }],
    }));
  };

  const removeSocialMediaEntry = (index) => {
    const social_media = [...newAttendee.social_media];
    social_media.splice(index, 1);
    setNewAttendee({ ...newAttendee, social_media });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const socialMediaObject = newAttendee.social_media.reduce(
      (acc, entry) => {
        if (entry.platform && entry.handle) {
          acc[entry.platform] = entry.handle;
        }
        return acc;
      },
      {}
    );

    const attendeeToSubmit = {
      ...newAttendee,
      social_media: socialMediaObject,
      created_by_id: user.user_id // Include the user's ID for tracking

    };

    fetch("https://phase4project-xp0u.onrender.com//attendees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendeeToSubmit),
      credentials: "include",
    })
      .then((response) => response.json())
      .then(() => {
        navigate("/attendees"); // Redirect to the attendees list after creation
      })
      .catch((error) => console.error("Error creating attendee:", error));
  };

  return (
    <div className="create-attendee-container">
      <h2>Create Attendee</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name</label>
        <input
          placeholder="[Enter First Name]"
          type="text"
          name="first_name"
          id="first_name"
          value={newAttendee.first_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="last_name">Last Name</label>
        <input
          placeholder="[Enter Last Name]"
          type="text"
          name="last_name"
          id="last_name"
          value={newAttendee.last_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          placeholder="[Enter Email]"
          type="email"
          name="email"
          id="email"
          value={newAttendee.email}
          onChange={handleInputChange}
          required
        />

        <label>Social Media:</label>
        {newAttendee.social_media.map((entry, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Platform"
              value={entry.platform}
              onChange={(e) =>
                handleSocialMediaChange(index, "platform", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Handle"
              value={entry.handle}
              onChange={(e) =>
                handleSocialMediaChange(index, "handle", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeSocialMediaEntry(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addSocialMediaEntry}>
          Add Social Media
        </button>

        <label>Favorite Event Types:</label>
        <select
          className="attendee-select-event-type"
          multiple
          value={newAttendee.favorite_event_types}
          onChange={handleEventTypeSelection}
        >
          {eventTypes.map((eventType) => (
            <option key={eventType} value={eventType}>
              {eventType}
            </option>
          ))}
        </select>

        <label>Favorite Artists:</label>
        <input
          type="text"
          placeholder="Search Artists"
          value={artistSearchTerm}
          onChange={(e) => setArtistSearchTerm(e.target.value)}
        />
        <div className="event-checkboxes">
          {artists
            .filter((artist) =>
              artist.name.toLowerCase().includes(artistSearchTerm.toLowerCase())
            )
            .map((artist) => (
              <div key={artist.id}>
                <input
                  type="checkbox"
                  id={`artist-${artist.id}`}
                  value={artist.id}
                  checked={newAttendee.favorite_artist_ids.includes(artist.id)}
                  onChange={() => handleArtistSelection(artist.id)}
                />
                <label htmlFor={`artist-${artist.id}`}>{artist.name}</label>
              </div>
            ))}
        </div>

        <label>Favorite Events:</label>
        <input
          type="text"
          placeholder="Search Events"
          value={eventSearchTerm}
          onChange={(e) => setEventSearchTerm(e.target.value)}
        />
        <div className="event-checkboxes">
          {events
            .filter((event) =>
              event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
            )
            .map((event) => (
              <div key={event.id}>
                <input
                  type="checkbox"
                  id={`event-${event.id}`}
                  value={event.id}
                  checked={newAttendee.favorite_event_ids.includes(event.id)}
                  onChange={() => handleFavoriteEventSelection(event.id)}
                />
                <label htmlFor={`event-${event.id}`}>{event.name}</label>
              </div>
            ))}
        </div>

        <label>Favorite Venues:</label>
        <input
          type="text"
          placeholder="Search Venues"
          value={venueSearchTerm}
          onChange={(e) => setVenueSearchTerm(e.target.value)}
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
                <input
                  type="checkbox"
                  id={`venue-${venue.id}`}
                  value={venue.id}
                  checked={newAttendee.favorite_venues.some(
                    (fv) => fv.venue_id === venue.id
                  )}
                  onChange={() => handleVenueSelection(venue.id)}
                />
                <label htmlFor={`venue-${venue.id}`}>{venue.name}</label>
                {/* Rating input for the selected venue */}
                {newAttendee.favorite_venues.some(
                  (fv) => fv.venue_id === venue.id
                ) && (
                  <div>
                    <label>
                      Rating:
                      <select
                        value={
                          newAttendee.favorite_venues.find(
                            (fv) => fv.venue_id === venue.id
                          ).rating || 1
                        }
                        onChange={(e) =>
                          handleVenueRatingChange(venue.id, e.target.value)
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

        <button type="submit">Create Attendee</button>
      </form>
    </div>
  );
}

export default CreateAttendee;

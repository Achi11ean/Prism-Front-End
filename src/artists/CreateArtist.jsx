import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateArtist.css";

function CreateArtist() {
  const [events, setEvents] = useState([]); // State for events
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    background: "",
    songs: "",
    event_ids: [],
  });
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [ageError, setAgeError] = useState(""); // State for age validation error
  const navigate = useNavigate();

  // Fetch available events from the backend
  useEffect(() => {
    fetch("https://phase4project-xp0u.onrender.com/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const validateAge = (age) => {
    return age >= 18; // Validate age is 18 or older
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure the age is valid before submitting
    if (!validateAge(Number(formData.age))) {
      setAgeError("Artist must be at least 18 years old.");
      return;
    }

    // Ensure event_ids are integers
    const updatedFormData = {
      ...formData,
      event_ids: formData.event_ids.map(Number),
    };

    fetch("https://phase4project-xp0u.onrender.com/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Artist created:", data);
        navigate("/artists"); // Redirect to artist list
      })
      .catch((error) => {
        console.error("Error creating artist:", error);
        alert("Failed to create artist");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the age error when user starts typing again
    if (name === "age" && ageError) {
      setAgeError("");
    }
  };

  const handleEventSelection = (eventId) => {
    setFormData((prevState) => {
      const isSelected = prevState.event_ids.includes(eventId);
      return {
        ...prevState,
        event_ids: isSelected
          ? prevState.event_ids.filter((id) => id !== eventId)
          : [...prevState.event_ids, eventId],
      };
    });
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
  );

  return (
    <div className="create-artist-container">
      <h2>Create Artist</h2>
      <form onSubmit={handleSubmit}>
        <label className="labels" htmlFor="artistName">Name</label>
        <input
          placeholder="[Enter Stage Name]"
          type="text"
          id="artistName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="labels" htmlFor="artistAge">Age</label>
        <input
          placeholder="[Enter Age]"
          type="number"
          id="artistAge"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          min={18}
          max={100} // HTML5 constraint to block ages below 18
        />
        {ageError && <p className="error-message">{ageError}</p>}

        <label className="labels" htmlFor="artistBackground">Background</label>
        <textarea
          placeholder="[Social Media: @HarmonicEssence | Performance Goals:...]"
          id="artistBackground"
          name="background"
          value={formData.background}
          onChange={handleChange}
          required
        ></textarea>

        <label className="labels" htmlFor="artistSongs">Songs</label>
        <textarea
          placeholder="[Enter song names or links or N/A]"
          id="artistSongs"
          name="songs"
          value={formData.songs}
          onChange={handleChange}
          required
        />

        <label className="labels" htmlFor="eventSelect">Events</label>
        <input
          type="text"
          placeholder="Search Events..."
          value={eventSearchTerm}
          onChange={(e) => setEventSearchTerm(e.target.value)}
          className="event-search"
        />
        <div
          className="event-checkboxes"
          style={{
            maxHeight: "150px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "5px",
            marginLeft: "1px",
          }}
        >
          {filteredEvents.map((event) => (
            <div key={event.id}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.event_ids.includes(event.id)}
                  onChange={() => handleEventSelection(event.id)}
                />
                {event.name}
              </label>
            </div>
          ))}
        </div>

        <button type="submit">Create Artist</button>
      </form>
    </div>
  );
}

export default CreateArtist;

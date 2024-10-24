import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VenueList.css';

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    organizer: '',
    email: '',
    earnings: '',
    description: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [displayLimit, setDisplayLimit] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const url = searchTerm
      ? `https://phase4project-xp0u.onrender.com/venues/search?name=${searchTerm}`
      : 'https://phase4project-xp0u.onrender.com/venues';

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setErrorMessage('No venues found matching your search.');
        } else {
          setErrorMessage('');
          setVenues(data);
        }
      })
      .catch((error) => {
        setErrorMessage('No Matching Criteria.');
        console.error('Error fetching venues:', error);
      });
  }, [searchTerm]);

  const handleEditClick = (venue) => {
    setEditingVenueId(venue.id);
    setEditFormData({
      name: venue.name,
      organizer: venue.organizer,
      email: venue.email,
      earnings: venue.earnings,
      description: venue.description
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });

    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailPattern.test(value) ? '' : 'Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleSaveClick = (venueId) => {
    if (emailError) {
      alert('Please fix the errors before saving.');
      return;
    }

    fetch(`https://phase4project-xp0u.onrender.com/venues/${venueId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData),
    })
      .then((response) => response.json())
      .then((updatedVenue) => {
        setVenues(venues.map((venue) => (venue.id === venueId ? updatedVenue : venue)));
        setEditingVenueId(null);
      })
      .catch((error) => console.error('Error updating venue:', error));
  };

  const handleCancelClick = () => {
    setEditingVenueId(null);
  };

  const handleDeleteClick = (venueId) => {
    fetch(`https://phase4project-xp0u.onrender.com/venues/${venueId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setVenues(venues.filter((venue) => venue.id !== venueId));
      })
      .catch((error) => console.error('Error deleting venue:', error));
  };

  const loadMoreVenues = () => {
    setDisplayLimit((prevLimit) => prevLimit + 5);
  };

  return (
    <div className="venue-list-container">
      <h2>Venue List</h2>

      {/* Create button */}
      <button className="Createvenue" onClick={() => navigate("/create-venue")}>Create Venue</button>
      {/* Search input */}
      <input
        className='search-venue'
        type="text"
        placeholder="Search Venues by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {errorMessage && (
        <p className="error-message" style={{ color: 'black', fontSize: '2em', backgroundColor: "white" }}>
          {errorMessage}
        </p>
      )}

      {emailError && (
        <p className="email-error" style={{ color: 'red' }}>
          {emailError}
        </p>
      )}

      <table border="1" cellPadding="10" className="venue-table">
        <thead>
          <tr>
            <th>ID:</th>
            <th>Name:</th>
            <th>Organizer:</th>
            <th>Email:</th>
            <th>Earnings:</th>
            <th>Description:</th>
            <th>Ratings:</th>
            <th>Actions:</th>
          </tr>
        </thead>
        <tbody>
          {venues.slice(0, displayLimit).map((venue) => (
            <tr key={venue.id}>
              {editingVenueId === venue.id ? (
                <>
                  {/* Editing Mode */}
                  <td data-label="ID">{venue.id}</td>
                  <td data-label="Name">
                    <input
                      className='editvenue'
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td data-label="Organizer">
                    <input
                      className='editvenue'
                      type="text"
                      name="organizer"
                      value={editFormData.organizer}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td data-label="Email">
                    <input
                      className='editvenue'
                      type="text"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td data-label="Earnings">
                    <input
                      className='editvenue'
                      type="text"
                      name="earnings"
                      value={editFormData.earnings}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td data-label="Description">
                    <textarea
                      className='editvenue'
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      rows="3"
                    />
                  </td>
                  <td data-label="Ratings:">
                    {venue.average_rating !== null && venue.average_rating !== undefined ? (
                      <div>
                        <strong>Average Rating: {venue.average_rating.toFixed(2)}</strong>
                      </div>
                    ) : (
                      <span>No ratings</span>
                    )}
                  </td>
                  <td data-label="Actions">
                    <button className="Saveme" onClick={() => handleSaveClick(venue.id)}>Save</button>
                    <button className="Cancelme" onClick={handleCancelClick}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  {/* Non-Editing Mode */}
                  <td data-label="ID:">{venue.id}</td>
                  <td data-label="Name:">{venue.name}</td>
                  <td data-label="Organizer:">{venue.organizer}</td>
                  <td data-label="Email:">{venue.email}</td>
                  <td data-label="Earnings:">{venue.earnings}</td>
                  <td data-label="Description:">{venue.description}</td>
                  <td data-label="Ratings:">
                    {venue.average_rating !== null && venue.average_rating !== undefined ? (
                      <div>
                        <strong>Average Rating: {venue.average_rating.toFixed(2)}</strong>
                      </div>
                    ) : (
                      <span>No ratings</span>
                    )}
                  </td>
                  <td data-label="Actions:">
                    <button className="editbutton" onClick={() => handleEditClick(venue)}>Edit</button>
                    <button className="deletebutton" onClick={() => handleDeleteClick(venue.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Load More button */}
      {displayLimit < venues.length && (
        <button onClick={loadMoreVenues} className="load-more-button">Load More</button>
      )}
    </div>
  );
}

export default VenueList;

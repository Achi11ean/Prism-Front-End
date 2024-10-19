import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VenueList.css';

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVenueId, setEditingVenueId] = useState(null);  // Track the venue being edited
  const [editFormData, setEditFormData] = useState({
    name: '',
    organizer: '',
    email: '',
    earnings: '',
    description: ''  // Added description field
  });
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [emailError, setEmailError] = useState(''); // State for email validation error
  const [displayLimit, setDisplayLimit] = useState(5); // State to limit number of displayed venues

  const navigate = useNavigate();

  useEffect(() => {
    const url = searchTerm
      ? `http://127.0.0.1:5001/venues/search?name=${searchTerm}`
      : 'http://127.0.0.1:5001/venues';
  
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
          setErrorMessage(''); // Clear error message if venues are found
          setVenues(data); // Update the venues list
        }
      })
      .catch((error) => {
        setErrorMessage('No Matching Criteria.');
        console.error('Error fetching venues:', error);
      });
  }, [searchTerm]);

  // Handle the edit button click to edit a venue
  const handleEditClick = (venue) => {
    setEditingVenueId(venue.id);
    setEditFormData({
      name: venue.name,
      organizer: venue.organizer,
      email: venue.email,
      earnings: venue.earnings,
      description: venue.description  // Populate the description field
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
    
    // Validate email when it changes
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailPattern.test(value) ? '' : 'Invalid email format');
    } else {
      setEmailError(''); // Clear email error for other fields
    }
  };

  // Save the updated venue data
  const handleSaveClick = (venueId) => {
    if (emailError) {
      alert('Please fix the errors before saving.'); // Alert for errors
      return;
    }

    fetch(`http://127.0.0.1:5001/venues/${venueId}`, {
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

  // Handle canceling the edit
  const handleCancelClick = () => {
    setEditingVenueId(null);
  };

  // Handle deleting a venue
  const handleDeleteClick = (venueId) => {
    fetch(`http://127.0.0.1:5001/venues/${venueId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setVenues(venues.filter((venue) => venue.id !== venueId));
      })
      .catch((error) => console.error('Error deleting venue:', error));
  };

  // Load more venues when the button is clicked
  const loadMoreVenues = () => {
    setDisplayLimit((prevLimit) => prevLimit + 5); // Increase limit by 5
  };

  return (
    <div className="venue-list-container">
      <h2>Venue List</h2>
  
      {/* Create button */}
      <button className="Createvenue" onClick={() => navigate("/create-venue")}>Create New Venue</button>
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
      )} {/* Error message display */}
  
      {emailError && (
        <p className="email-error" style={{ color: 'red' }}>
          {emailError}
        </p>
      )} {/* Email validation error display */}
      
      <table border="1" cellPadding="10" className="venue-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Organizer</th>
            <th>Email</th>
            <th>Earnings</th>
            <th>Description</th>  {/* New Description column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.slice(0, displayLimit).map((venue) => (  // Limit venues displayed by displayLimit
            <tr key={venue.id}>
              {editingVenueId === venue.id ? (
                <>
                  <td>{venue.id}</td>
                  <td>
                    <input
                      className='editvenue'
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className='editvenue'
                      type="text"
                      name="organizer"
                      value={editFormData.organizer}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className='editvenue'
                      type="text"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      className='editvenue'
                      type="text"
                      name="earnings"
                      value={editFormData.earnings}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <textarea
                      className='editvenue'
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      rows="3"
                    />
                  </td>
                  <td>
                    <button className="Saveme" onClick={() => handleSaveClick(venue.id)}>Save</button>
                    <button className="Cancelme" onClick={handleCancelClick}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{venue.id}</td>
                  <td>{venue.name}</td>
                  <td>{venue.organizer}</td>
                  <td>{venue.email}</td>
                  <td>{venue.earnings}</td>
                  <td>{venue.description}</td>  {/* Displaying description */}
                  <td>
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
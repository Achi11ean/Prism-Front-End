import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // To navigate after submission
import './CreateVenue.css';

function CreateVenue() {
    const [newVenue, setNewVenue] = useState({
        name: '',
        organizer: '',
        email: '',
        earnings: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVenue({ ...newVenue, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://127.0.0.1:5001/venues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newVenue),
        })
            .then((response) => response.json())
            .then(() => {
                navigate("/venues");  // Redirect to the Venue List page after creating the venue
            })
            .catch((error) => console.error('Error creating venue:', error));
    };

    return (
        <div className="create-venue-container">
            <h2>Create New Venue</h2>
            <form className="venue-form" onSubmit={handleSubmit}>
                <div>
                    <label>Venue Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newVenue.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Organizer:</label>
                    <input
                        type="text"
                        name="organizer"
                        value={newVenue.organizer}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={newVenue.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Earnings:</label>
                    <input
                        type="text"
                        name="earnings"
                        value={newVenue.earnings}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Create Venue</button>
            </form>
        </div>
    );
}

export default CreateVenue;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // To navigate after submission
import './CreateVenue.css';
import { useAuth } from '../AuthContext'; // Import useAuth to access user data

function CreateVenue() {
    const { user } = useAuth(); // Retrieve the current user from context
    const [newVenue, setNewVenue] = useState({
        name: '',
        organizer: '',
        email: '',
        earnings: '',
        description: ''  // Added description field
    });
    const [emailError, setEmailError] = useState(''); // State for email validation error
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVenue({ ...newVenue, [name]: value });

        // Reset email error when the user starts typing
        if (name === 'email') {
            setEmailError('');
        }
    };

    const validateEmail = (email) => {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Validate email before submitting
        if (!validateEmail(newVenue.email)) {
            setEmailError('Please enter a valid email address.');
            return; // Stop submission if the email is invalid
        }
    
        // Prepare the data to be submitted, including the creator's ID
        const venueToSubmit = {
            ...newVenue,
            user_id: user.user_id
        };
    
        fetch('https://phase4project-xp0u.onrender.com/venues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(venueToSubmit), // Use venueToSubmit here
            credentials: "include", // Include session credentials
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
                    <label htmlFor="venueName">Venue Name:</label>
                    <br />
                    <input
                        placeholder='CT: Zen Bar'
                        id="venueName"
                        type="text"
                        name="name"
                        value={newVenue.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="venueOrganizer">Organizer:</label>
                    <br />
                    <input
                        placeholder='[Enter Primary Event Organizer First and Last Name]'
                        type="text"
                        id="venueOrganizer"
                        name="organizer"
                        value={newVenue.organizer}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="email">Email:</label>
                    <br />
                    <input
                        placeholder='[Enter Your email Address Here]'
                        type="email"
                        id="email"
                        name="email"
                        value={newVenue.email}
                        onChange={handleInputChange}
                        required
                    />
                    {emailError && (
                        <p className="error-message" style={{ color: 'red', fontSize: '0.9em' }}>
                            {emailError}
                        </p>
                    )}
                </div>
                <br />
                <div>
                    <label htmlFor="earnings">Earnings:</label>
                    <br />
                    <input
                        placeholder='[Average Artist Earning: $100, Free Shots, Door Cover]'
                        type="text"
                        id="earnings"
                        name="earnings"
                        value={newVenue.earnings}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="description">Description:</label>
                    <br />
                    <textarea
                        placeholder='[Describe the venue details, ambiance, etc.]'
                        id="description"
                        name="description"
                        value={newVenue.description}
                        onChange={handleInputChange}
                        rows="4"
                        required
                    />
                </div>
                <button type="submit">Create Venue</button>
            </form>
        </div>
    );
}

export default CreateVenue;
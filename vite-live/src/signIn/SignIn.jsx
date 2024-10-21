import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between sign-in and sign-up
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    user_type: '', // 'artist', 'attendee', 'event', 'tour', 'venue'
  });
  const [errors, setErrors] = useState({}); // State for handling errors
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: '',
      password: '',
      user_type: '',
    });
    setErrors({}); // Clear errors when toggling
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error for the specific field on change
  };

  // Password validation function
  const validatePassword = (password) => {
    const validationErrors = {};

    if (!password) {
      validationErrors.password = 'Password is required.';
      return validationErrors;
    }

    if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long.';
    }

    if (password.length > 128) {
      validationErrors.password = 'Password must not exceed 128 characters.';
    }

    if (!/[A-Z]/.test(password)) {
      validationErrors.password = 'Password must contain at least one uppercase letter.';
    }

    if (!/[a-z]/.test(password)) {
      validationErrors.password = 'Password must contain at least one lowercase letter.';
    }

    if (!/\d/.test(password)) {
      validationErrors.password = 'Password must contain at least one digit.';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      validationErrors.password = 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).';
    }

    return validationErrors;
  };

  // Function to determine password strength
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};

    // Perform password validations only during sign-up
    if (isSignUp) {
      const pwdErrors = validatePassword(formData.password);
      if (Object.keys(pwdErrors).length > 0) {
        validationErrors.password = pwdErrors.password;
      }

      // Validate user_type selection
      if (!formData.user_type) {
        validationErrors.user_type = 'User type is required.';
      }
    }

    // You can add additional validations for other fields here if necessary

    // If there are validation errors, update the errors state and halt submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Optionally, focus on the first error field
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    const url = isSignUp ? 'http://127.0.0.1:5001/signup' : 'http://127.0.0.1:5001/signin';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include', // Include cookies for session
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          const userType = data.user_type; // Use the user_type from backend response
          // Redirect based on user_type
          if (isSignUp) {
            // Redirect to "create" page for the user type if signing up
            switch (userType) {
              case 'artist':
                navigate('/create-artist');
                break;
              case 'attendee':
                navigate('/create-attendee');
                break;
              case 'event':
                navigate('/create-event');
                break;
              case 'tour':
                navigate('/create-tour');
                break;
              case 'venue':
                navigate('/create-venue');
                break;
              default:
                navigate('/');
            }
          } else {
            // Redirect to "list" page for the user type if signing in
            switch (userType) {
              case 'artist':
                navigate('/artists');
                break;
              case 'attendee':
                navigate('/attendees');
                break;
              case 'event':
                navigate('/events');
                break;
              case 'tour':
                navigate('/tours');
                break;
              case 'venue':
                navigate('/venues');
                break;
              default:
                navigate('/');
            }
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred.');
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password requirements list
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
    { label: 'No more than 128 characters', test: (pw) => pw.length <= 128 },
    { label: 'At least one uppercase letter (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'At least one lowercase letter (a-z)', test: (pw) => /[a-z]/.test(pw) },
    { label: 'At least one digit (0-9)', test: (pw) => /\d/.test(pw) },
    { label: 'At least one special character (!@#$%^&*)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  return (
    <div className="sign-in-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input
          placeholder="[Enter Username]"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          aria-describedby="username-error"
        />
        {errors.username && <span id="username-error" className="error">{errors.username}</span>}

        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            placeholder="[Enter Password]"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-describedby="password-error"
          />
        </div>
        <div>
          <button type="button" className="toggle" onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <span id="password-error" className="error">{errors.password}</span>}

        {/* Password Strength Meter */}
        {isSignUp && (
          <div className="password-strength">
            <div className={`strength-bar strength-${getPasswordStrength(formData.password)}`}></div>
            <span>
              {getPasswordStrength(formData.password) <= 2
                ? 'Weak'
                : getPasswordStrength(formData.password) === 3
                ? 'Moderate'
                : 'Strong'}
            </span>
          </div>
        )}

        {/* Password Requirements Display */}
        {isSignUp && (
          <div className="password-requirements">
            <p>Password must contain:</p>
            <ul>
              {passwordRequirements.map((req, index) => (
                <li key={index} className={req.test(formData.password) ? 'valid' : 'invalid'}>
                  {req.test(formData.password) ? '✔' : '✖'} {req.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isSignUp && (
          <>
            <label htmlFor="user_type">User Type</label>
            <select
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              required
              aria-describedby="user_type-error"
            >
              <option value="">Select User Type</option>
              <option value="artist">Artist</option>
              <option value="attendee">Attendee</option>
              <option value="event">Event</option>
              <option value="tour">Tour</option>
              <option value="venue">Venue</option>
            </select>
            {errors.user_type && <span id="user_type-error" className="error">{errors.user_type}</span>}
          </>
        )}

        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <p>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button className="toggle-button" onClick={handleToggle}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}

export default SignIn;

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Adjust path as needed
import './AdminUserList.css'; // Import the CSS file

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const { user } = useAuth(); // Get the logged-in user's data
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]); // Store all users for resetting the search

  const [error, setError] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`https://phase4project-xp0u.onrender.com//admin/dashboard`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admin dashboard data');
        }

        const data = await response.json();
        setUsers(data.users);
        setAllUsers(data.users); 
        setMetrics(data.metrics);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user.user_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Convert from UTC to local time
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  
    return localDate.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // For AM/PM format
    });
  };

  const handleSearchChange = (e) => {
    const username = e.target.value;
    setSearchUsername(username);
    
    if (username) {
      fetchUsers(username); // Fetch users as the user types
    } else {
      setUsers(allUsers); // Reset to the original user list if input is empty
    }
  };

  const fetchUsers = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`https://phase4project-xp0u.onrender.com//search-users?username=${username}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`https://phase4project-xp0u.onrender.com//users/${userId}/role`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_type: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) => 
        prevUsers.map((user) => (user.id === userId ? updatedUser.user : user))
      );
    } catch (error) {
      setError(error.message);
    }
  };

  

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`https://phase4project-xp0u.onrender.com//users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        // Remove the user from the state after deletion
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {metrics && (
        <div className="metrics">
          <h3>Metrics</h3>
          <p>Total Active Users (Last 30 Days): {metrics.active_users_last_30_days}</p>
          <p>New Registrations (Last 30 Days): {metrics.new_registrations_last_30_days}</p>
          <h4>Daily Logins (Last 7 Days)</h4>
          <ul className="unorderedList">
            {Object.entries(metrics.daily_logins_last_7_days).map(([date, count]) => (
              <li key={date}>{date}: {count} logins</li>
            ))}
          </ul>
        </div>
      )}
      <h2>User List</h2>
      <input
        className="search"
        type="text"
        placeholder="Search by username"
        value={searchUsername}
        onChange={handleSearchChange} // Use the handler for input changes
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>User Type</th>
            <th>Profile Completed</th>
            <th>Created At</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.user_type}</td>
              <td>{user.profile_completed ? 'Yes' : 'No'}</td>
              <td>{formatDate(user.created_at)}</td>
              <td>{formatDate(user.last_login)}</td>
              <td>
                <select
                  defaultValue={user.user_type}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="attendee">Attendee</option>
                  <option value="artist">Artist</option>
                  <option value="venue">Venue</option>
                </select>
                <button className="deleteUser" onClick={() => deleteUser(user.id)} >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
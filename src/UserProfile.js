// UserProfile.js
import React, { useState } from 'react';
import { useUser } from './UserContext';
import './UserProfile.css';

function UserProfile() {
  const { userData, updateUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...userData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    updateUserData(form);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <img src={form.profileUrl} alt="Profile" className="profile-img" />
      {isEditing ? (
        <div className="form">
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="details">
          <p><strong>Username:</strong> {form.username}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;

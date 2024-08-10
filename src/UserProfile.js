import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function UserProfile() {
  const { userData, updateUserData, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...userData });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out the user from Firebase
      localStorage.clear(); // Clears local storage
      navigate('/login'); // Redirects to the login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      setForm(userData); // Update the form state when userData is loaded
    }
  }, [userData, loading]);

  const splitName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return { firstName, lastName };
  };

  const { firstName, lastName } = splitName(form.username);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    updateUserData(form);
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Handle the loading state
  }

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <img src={form.profileUrl} alt="Profile" className="profile-img" />
      {isEditing ? (
        <div className="form">
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => handleChange({ target: { name: 'username', value: `${e.target.value} ${lastName}` } })}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => handleChange({ target: { name: 'username', value: `${firstName} ${e.target.value}` } })}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="details">
          <p><strong>First Name:</strong> {firstName}</p>
          <p><strong>Last Name:</strong> {lastName}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone:</strong> {form.phone}</p>
          <p><strong>Department:</strong> {form.department}</p>
          <p><strong>Address:</strong> {form.address}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleLogout}>Logout</button>

        </div>
      )}
    </div>
  );
}

export default UserProfile;

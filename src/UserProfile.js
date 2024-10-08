import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './UserProfile.css';
import Notification from './Notifications';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const { userData, updateUserData, loading, handleLogout, profileurl } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...userData });
  const [step, setStep] = useState(1);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [previewUrl, setPreviewUrl] = useState(profileurl); 
  const handleNotificationClose = () => {
    setNotification({ message: '', type: '' });
  };

  useEffect(() => {
    if (!loading && userData) {
      setForm(userData);
      setPreviewUrl(profileurl)
    }
  }, [userData, loading, profileurl]);

  

  const splitName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return { firstName, lastName };
  };

  const { firstName, lastName } = splitName(form?.username || 'John Doe');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      setNotification({ message: 'Only image files are allowed (JPEG, PNG, GIF)', type: 'error' });
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChangeProfilePicture = () => {
    // Handle profile picture upload to the backend here
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSave = () => {
    updateUserData(form);
    setIsEditing(false);
    setStep(1);
  };

  console.log(previewUrl)
  const handleCancel = () => {
    setIsEditing(false);
    setStep(1);
    setForm(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  // Check if the app is still loading user data
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is no userData, display a dummy page with login/signup buttons
  if (!userData) {
    return (
      <div className="dummy-page">
        <div className="content-container">
          <h1>Welcome to Unibook</h1>
          <p>Please login or signup to access your profile.</p>
          <button onClick={() => navigate("/login")} className='login-button'>Login</button>
          <button onClick={() => navigate("/signup")} className='signup-button'>Signup</button>
        </div>
      </div>
    );
  }

  // If userData exists, show the user profile
  return (
    <div className="user-profile">
      {notification.message && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={handleNotificationClose} 
        />
      )}
      <h1 className="profile-heading">User Profile</h1>
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={previewUrl}
            alt="Profile"
            className="profile-img"
            onClick={toggleProfileModal}
          />
        </div>
        <div className="profile-info">
          <h2>{firstName} {lastName}</h2>
          <p className="email">{form?.email || "johndoe@somebody.com"}</p>
        </div>
      </div>

      {/* Full-Screen Profile Picture Modal */}
      {isProfileModalOpen && (
        <div className="profile-modal" onClick={toggleProfileModal}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Full Profile" className="full-profile-img" />
            <button className="change-profile-button" onClick={() => document.getElementById('file-input').click()}>
              Change Profile Picture
            </button>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {selectedFile && (
              <button className="upload-button" onClick={handleChangeProfilePicture}>
                Upload
              </button>
            )}
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="form">
          <p className="step-indicator">Step {step} of 3</p>
          {step === 1 && (
            <>
              <label>First Name:
                <input type="text" name="firstName" value={firstName} onChange={(e) => handleChange({ target: { name: 'username', value: `${e.target.value} ${lastName}` } })} />
              </label>
              <label>Last Name:
                <input type="text" name="lastName" value={lastName} onChange={(e) => handleChange({ target: { name: 'username', value: `${firstName} ${e.target.value}` } })} />
              </label>
              <label>Email:
                <input type="email" name="email" value={form?.email || "johndoe@somebody.com"} disabled />
              </label>
              <button className="next-button" onClick={handleNextStep}>Next</button>
            </>
          )}
          {step === 2 && (
            <>
              <label>Phone:
                <input type="text" name="phone" value={form?.phone || "+234 000 000 0000"} onChange={handleChange} />
              </label>
              <label>Department:
                <input type="text" name="department" value={form?.department || ""} onChange={handleChange} />
              </label>
              <button className="next-button" onClick={handleNextStep}>Next</button>
              <button className="prev-button" onClick={handlePreviousStep}>Back</button>
            </>
          )}
          {step === 3 && (
            <>
              <div className="address-group">
                <label>Flat No./Apartment:
                  <input type="text" name="flatNo" value={form?.flatNo || ""} onChange={handleChange} />
                </label>
                <label>Street:
                  <input type="text" name="street" value={form?.street || " "} onChange={handleChange} />
                </label>
              </div>
              <div className="address-group">
                <label>City:
                  <input type="text" name="city" value={form?.city || " "} onChange={handleChange} />
                </label>
                <label>State:
                  <input type="text" name="state" value={form?.state || " "} onChange={handleChange} />
                </label>
                <label>Postal Code:
                  <input type="text" name="postalCode" value={form?.postal_code || " "} onChange={handleChange} />
                </label>
              </div>
              <div className="buttons">
                <div className="button-group">
                  <button className="prev-button" onClick={handlePreviousStep}>Back</button>
                  <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  <button className="save-button" onClick={handleSave}>Save</button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="user-details-container">
          <div className="user-details">
            <p className="detail-item"><strong>First Name:</strong> {firstName}</p>
            <p className="detail-item"><strong>Last Name:</strong> {lastName}</p>
            <p className="detail-item"><strong>Email:</strong> {form?.email || "johndoe@somebody.com"}</p>
            <p className="detail-item"><strong>Phone:</strong> {form?.phone || "+234 000 000 0000"}</p>
            <p className="detail-item"><strong>Department:</strong> {form?.department || ""}</p>
            <p className="detail-item"><strong>Address:</strong> {form?.flat_no || " "} {form?.street || ""} {form?.city || ""}, {form?.state || ""} {form?.postal_code || ""}</p>
          </div>
          <div className="buttons">
            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;

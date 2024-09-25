import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './FabButton.css'; // External CSS file for styling

const FabButton = ({ isAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { userData, loading } = useUser();
  const [newUsername, setNewUsername] = useState(userData?.username || '');
  const [newEmail, setNewEmail] = useState(userData?.email || '');
    console.log(newUsername)
  const togglePopup = () => {
    if (isOpen) {
      setIsClosing(true); // Start the closing animation
      setTimeout(() => {
        setIsOpen(false); // Wait until the animation ends, then close
        setIsClosing(false);
      }, 400); // Duration matches the slideDown animation duration
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    // Only set the state when loading is done and userData is available
    if (!loading && userData) {
      setNewUsername(userData.username || '');
      setNewEmail(userData.email || '');
    }
  }, [loading, userData]);

  // Function to handle changes in inputs
  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    togglePopup(); // Optionally close popup after submission
  };
  const handlePopupClick = (event) => {
    event.stopPropagation(); // Prevents the click event from reaching the parent div
  };

  return (
    <div>
      <button className="fab-btn" onClick={togglePopup}>
      <i class='bx bx-support bx-tada'></i>
      </button>

      {isOpen && (
        <div className={`popup-modal ${isClosing ? 'fade-out' : 'fade-in'}`} onClick={togglePopup}>
          <div className={`chat-popup ${isClosing ? 'slide-down' : 'slide-up'}`} onClick={handlePopupClick}>
            <div className="chat-header">
              <h2>Need Help?</h2>
              <button className="close-btn" onClick={togglePopup}>X</button>
            </div>
            <div className="chat-body">
              <p>Let us know how we can assist you.</p>
              <form className="chat-form" onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newUsername}
                    className="input-field"
                    onChange={handleChange(setNewUsername)}
                  />
                  <label className="label-input">Full Name</label>
                </div>

                {/* Email Field */}
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={newEmail}
                    className="input-field"
                    onChange={handleChange(setNewEmail)}
                  />
                  <label className="label-input">Email</label>
                </div>

                {/* Message Field */}
                <div className="input-group">
                  <textarea
                    placeholder="How can we help you today"
                    className="message-input"
                  ></textarea>
                  <label className="labels-input">Message</label>
                </div>

                <button type="submit" className="send-btn">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FabButton;

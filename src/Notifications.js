import React from 'react';
import './Notifications.css';
import Deal from './uni2.png'

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <img src={Deal} alt="logo" className="notification-img" />
      <span>{message}</span>
      <button onClick={onClose}><i className="fas fa-times"></i></button>
    </div>
  );
};

export default Notification;

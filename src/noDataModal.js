import React from 'react';
import './Modals.css';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Welcome to Unibooks</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <p>Discover a world of knowledge with Unibooks. Whether you're looking to explore new books or track your favorite ones, we've got you covered!</p>
        </div>
        <div className="modal-footer">
          <button className="cta-button">Get Started</button>
          <button onClick={onClose} className="secondary-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

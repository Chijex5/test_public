import React from 'react';
import './Modal.css'; // Custom styling

const Modal = ({ show, closeModal, resendVerification }) => {
  if (!show) {
    return null;
  }
  return (
    <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
            <h2>Email Verification Required</h2>
            <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
            <p>A verification email has been sent to your inbox. Please verify your email to continue.</p>
            <button className="resend-button" onClick={resendVerification}>
                Resend Verification Email
            </button>
            </div>
        </div>
    </div>

  );
};

export default Modal;

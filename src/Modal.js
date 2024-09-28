import React from 'react';
import './Modal.css'; // Custom styling

const Modal = ({ show, closeModal, resendVerification }) => {
  if (!show) {
    return null;
  }
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <header className="modal-header">
              <h2>Email Verification Required</h2>
              <button className="close-button" onClick={closeModal} aria-label="Close modal">
                  &times;
              </button>
          </header>
          <section className="modal-body">
              <p className="verification-message">A verification email has been sent to your inbox. Please check your inbox to complete the verification process.</p>
              
              <div className="resend-instructions">
                  <p>If you can't find the email, it may be in your spam or junk folder. You can also request a new verification email below.</p>
              </div>

              <button className="resend-button" onClick={resendVerification}>
                  Resend Verification Email
              </button>
          </section>
      </div>
  </div>



  );
};

export default Modal;

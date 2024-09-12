import React, { useState } from 'react';

const Step4 = ({ prevStep, handleDataChange }) => {
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('');

  const handleFinish = () => {
    handleDataChange('address', address);
    handleDataChange('department', department);
    // Save data and navigate to home page
  };

  return (
    <div className="auth-card">
      <h2>Final Details</h2>
      <input
        type="text"
        className="auth-input"
        value={address}
        placeholder="Address"
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="text"
        className="auth-input"
        value={department}
        placeholder="Department"
        onChange={(e) => setDepartment(e.target.value)}
        required
      />
      <button onClick={handleFinish} className="finish-button">
        Finish
      </button>
      <button onClick={prevStep} className="prev-button">
        Back
      </button>
    </div>
  );
};

export default Step4;

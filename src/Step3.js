import React, { useState } from 'react';

const Step3 = ({ nextStep, prevStep, handleDataChange }) => {
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('');

  const handleNext = () => {
    handleDataChange('phone', phone);
    handleDataChange('level', level);
    nextStep();
  };

  return (
    <div className="auth-card">
      <h2>Contact Information</h2>
      <input
        type="text"
        className="auth-input"
        value={phone}
        placeholder="Phone Number"
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <select
        className="auth-input"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        required
      >
        <option value="" disabled>Select your Level</option>
        <option value="100">100 Level</option>
        <option value="200">200 Level</option>
        <option value="300">300 Level</option>
        <option value="400">400 Level</option>
        <option value="500">500 Level</option>
        <option value="600">600 Level</option>
      </select>
      <button onClick={handleNext} className="next-button">
        Next
      </button>
      <button onClick={prevStep} className="prev-button">
        Back
      </button>
    </div>
  );
};

export default Step3;

import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import Loaders from './Loader'
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Step2 = ({ nextStep, prevStep, userData, handleDataChange }) => {
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState(userData.fullname);

  useEffect(() => {
    const fetchFullname = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const userDoc = doc(db, 'users', auth.currentUser.uid);

      setLoading(true);
      const docSnapshot = await getDoc(userDoc);

      if (docSnapshot.exists()) {
        setFullname(docSnapshot.data().fullname);
      }
      setLoading(false);
    };

    fetchFullname();
  }, []);

  const handleNext = () => {
    handleDataChange('fullname', fullname);
    nextStep();
  };

  return (
    <div className="auth-card">
      <h2>Your Name</h2>
      {loading ? (
        <Loaders />
      ) : (
        <input
          type="text"
          className="auth-input"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
      )}
      <button onClick={handleNext} className="next-button">
        Next
      </button>
      <button onClick={prevStep} className="prev-button">
        Back
      </button>
    </div>
  );
};

export default Step2;

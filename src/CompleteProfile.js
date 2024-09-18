import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import './CompleteProfile.css';
import Loader from './Loader';
import configureBaseUrl from './configureBaseUrl';
import { useUser } from './UserContext';
const CompleteProfile = ({ user }) => {
    const {saveUserDataToLocalStorage} = useUser();
    const [fullName, setFullName] = useState(user.displayName || '');
    const [phone, setPhone] = useState('');
    const [flatNo, setFlatNo] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [level, setLevel] = useState('');
    const [department, setDepartment] = useState('');
    const [stage, setStage] = useState(1); // Current stage of the form
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const options = [
        {
          label: "Agriculture",
          options: [
            { value: "Animal Science", label: "Animal Science" },
            { value: "Soil Science", label: "Soil Science" },
            { value: "Agric. Economics", label: "Agric. Economics" },
            { value: "Agric. Extension", label: "Agric. Extension" },
          ],
        },
        {
          label: "Arts",
          options: [
            { value: "Mass Communication", label: "Mass Communication" },
            { value: "Archaeology & Tourism", label: "Archaeology & Tourism" },
            { value: "History & International Studies", label: "History & International Studies" },
            { value: "Fine & Applied Arts", label: "Fine & Applied Arts" },
            { value: "Performing Arts", label: "Performing Arts" },
            { value: "Music", label: "Music" },
            { value: "English & Literary Studies", label: "English & Literary Studies" },
            { value: "Foreign Languages", label: "Foreign Languages" },
            { value: "Linguistics & Nigerian Languages", label: "Linguistics & Nigerian Languages" },
          ],
        },
        {
          label: "Biological Sciences",
          options: [
            { value: "Microbiology", label: "Microbiology" },
            { value: "Biochemistry", label: "Biochemistry" },
            { value: "Genetics & Biotechnology", label: "Genetics & Biotechnology" },
            { value: "Plant Sciences", label: "Plant Sciences" },
            { value: "Zoology", label: "Zoology" },
          ],
        },
        {
          label: "Business Administration",
          options: [
            { value: "Accountancy", label: "Accountancy" },
            { value: "Marketing", label: "Marketing" },
            { value: "Business Administration", label: "Business Administration" },
            { value: "Banking & Finance", label: "Banking & Finance" },
            { value: "Management", label: "Management" },
          ],
        },
        {
          label: "Education",
          options: [
            { value: "Arts Education", label: "Arts Education" },
            { value: "Science Education", label: "Science Education" },
            { value: "Adult Education", label: "Adult Education" },
            { value: "Education Foundation", label: "Education Foundation" },
            { value: "Health & Physical Education", label: "Health & Physical Education" },
            { value: "Library Sciences Education", label: "Library Sciences Education" },
            { value: "Social Science Education", label: "Social Science Education" },
            { value: "Computer Education", label: "Computer Education" },
            { value: "Home Economics", label: "Home Economics" },
            { value: "Vocational Teacher Education", label: "Vocational Teacher Education" },
          ],
        },
        {
          label: "Engineering",
          options: [
            { value: "Civil Engineering", label: "Civil Engineering" },
            { value: "Electronic Engineering", label: "Electronic Engineering" },
            { value: "Electrical Engineering", label: "Electrical Engineering" },
            { value: "Mechanical Engineering", label: "Mechanical Engineering" },
            { value: "Agric. & Bioresources Engineering", label: "Agric. & Bioresources Engineering" },
            { value: "Materials & Metallurgical Engineering", label: "Materials & Metallurgical Engineering" },
          ],
        },
        {
          label: "Dentistry",
          options: [
            { value: "Child Dental Health", label: "Child Dental Health" },
            { value: "Oral Maxillofacial Surgery", label: "Oral Maxillofacial Surgery" },
            { value: "Preventive Dentistry", label: "Preventive Dentistry" },
            { value: "Restorative Dentistry", label: "Restorative Dentistry" },
          ],
        },
        {
          label: "Environmental Studies",
          options: [
            { value: "Estate Management", label: "Estate Management" },
            { value: "Urban & Regional Planning", label: "Urban & Regional Planning" },
            { value: "Architecture", label: "Architecture" },
            { value: "Surveying & Geodesy", label: "Surveying & Geodesy" },
          ],
        },
        {
          label: "Health Science and Technology",
          options: [
            { value: "Medical Rehabilitation", label: "Medical Rehabilitation" },
            { value: "Nursing Sciences", label: "Nursing Sciences" },
            { value: "Medical Laboratory Technology", label: "Medical Laboratory Technology" },
          ],
        },
        {
          label: "Law",
          options: [
            { value: "Public & Private Law", label: "Public & Private Law" },
            { value: "International Law & Jurisprudence", label: "International Law & Jurisprudence" },
            { value: "Property Law", label: "Property Law" },
          ],
        },
        {
          label: "Pharmaceutical Sciences",
          options: [
            { value: "Clinical Pharmacy", label: "Clinical Pharmacy" },
            { value: "Pharmaceutical and Medicinal Chemistry", label: "Pharmaceutical and Medicinal Chemistry" },
            { value: "Pharmacology and Toxicology", label: "Pharmacology and Toxicology" },
            { value: "Pharmaceutics", label: "Pharmaceutics" },
            { value: "Pharmaceutical Technology", label: "Pharmaceutical Technology" },
            { value: "Pharmacognosy", label: "Pharmacognosy" },
            { value: "Pharmacognosy and Environmental Medicines", label: "Pharmacognosy and Environmental Medicines" },
          ],
        },
        {
          label: "Physical Sciences",
          options: [
            { value: "Statistics", label: "Statistics" },
            { value: "Physics & Astronomy", label: "Physics & Astronomy" },
            { value: "Computer Science", label: "Computer Science" },
            { value: "Geology", label: "Geology" },
            { value: "Pure and Industrial Chemistry", label: "Pure and Industrial Chemistry" },
            { value: "Mathematics", label: "Mathematics" },
          ],
        },
        {
          label: "Social Sciences",
          options: [
            { value: "Philosophy", label: "Philosophy" },
            { value: "Public Administration", label: "Public Administration" },
            { value: "Psychology", label: "Psychology" },
            { value: "Economics", label: "Economics" },
            { value: "Geography", label: "Geography" },
            { value: "Sociology & Anthropology", label: "Sociology & Anthropology" },
            { value: "Religious and Cultural Studies", label: "Religious and Cultural Studies" },
            { value: "Social Work", label: "Social Work" },
          ],
        },
        {
          label: "Medical Sciences",
          options: [
            { value: "Anaesthesia", label: "Anaesthesia" },
            { value: "Anatomy", label: "Anatomy" },
            { value: "Chemical Pathology", label: "Chemical Pathology" },
            { value: "Community Medicine", label: "Community Medicine" },
            { value: "Dermatology", label: "Dermatology" },
            { value: "Haematology & Immunology", label: "Haematology & Immunology" },
            { value: "Medical Biochemistry", label: "Medical Biochemistry" },
            { value: "Medical Microbiology", label: "Medical Microbiology" },
            { value: "Morbid Anatomy", label: "Morbid Anatomy" },
            { value: "Obstetrics & Gynaecology", label: "Obstetrics & Gynaecology" },
            { value: "Ophthalmology", label: "Ophthalmology" },
            { value: "Otolaryngology", label: "Otolaryngology" },
            { value: "Paediatrics", label: "Paediatrics" },
            { value: "Paediatric Surgery", label: "Paediatric Surgery" },
            { value: "Pharmacology & Therapeutics", label: "Pharmacology & Therapeutics" },
            { value: "Physiological Medicine", label: "Physiological Medicine" },
            { value: "Radiation Medicine", label: "Radiation Medicine" },
            { value: "Surgery", label: "Surgery" },
          ],
        },
        {
          label: "Veterinary Medicine",
          options: [
            { value: "Veterinary Pathology and Microbiology", label: "Veterinary Pathology and Microbiology" },
            { value: "Veterinary Obstetrics and Reproductive Diseases", label: "Veterinary Obstetrics and Reproductive Diseases" },
            { value: "Veterinary Physiology and Pharmacology", label: "Veterinary Physiology and Pharmacology" },
            { value: "Veterinary Anatomy", label: "Veterinary Anatomy" },
            { value: "Veterinary Medicine", label: "Veterinary Medicine" },
            { value: "Veterinary Surgery", label: "Veterinary Surgery" },
            { value: "Veterinary Parasitology & Entomology", label: "Veterinary Parasitology & Entomology" },
            { value: "Animal Health & Production", label: "Animal Health & Production" },
          ],
        },
      ];
      
      

      const [baseUrl, setBaseUrl] = useState('');

      useEffect(() => {
        const fetchBaseUrl = async () => {
          const url = configureBaseUrl();
          setBaseUrl(url);
          
        };
    
        fetchBaseUrl();
      }, []);

  useEffect(() => {
    if (user.displayName) {
      setFullName(user.displayName);
    }
  }, [user.displayName]);

  const sendUserDataToBackend = async (user, additionalData) => {
    try {
      const response = await axios.post(`${baseUrl}/complete-profile`, {
        user_id: user.uid,
        email: user.email,
        username: fullName || "",
        profileUrl: user.photoURL || "",
        level: additionalData.level || "",
        flatNo: additionalData.flatNo || "",
        street: additionalData.street || "",
        city: additionalData.city || "",
        state: additionalData.state || "",
        postalCode: additionalData.postalCode || "",
        phone: additionalData.phone || "",
        department: additionalData.department || ""
      });

      const userData = response.data;

      if (userData.error) {
        setError(userData.error);
        return;
      }

      if (response.status === 201) {
        console.log('Profile completed successfully');
      }

      const userToSave = {
        userId: user.uid,
        username: fullName || user.displayName || "Anonymous",
        email: user.email,
        profileUrl: userData.profileUrl || user.photoURL || "",
        level: userData.level || additionalData.level || "",
        flatNo: userData.flatNo || additionalData.flatNo || "",
        street: userData.street || additionalData.street || "",
        city: userData.city || additionalData.city || "",
        state: userData.state || additionalData.state || "",
        postalCode: userData.postalCode || additionalData.postalCode || "",
        phone: userData.phone || additionalData.phone || "",
        department: userData.department || additionalData.department || ""
      };
      localStorage.setItem('user', JSON.stringify(userToSave));
      } catch (err) {
        console.error('Backend Error:', err);
        setError('Failed to send user data to backend.');
      }
      };

      const handleDepartmentChange = (selectedOption) => {
        setSelectedDepartment(selectedOption); // Update selected department state
        setDepartment(selectedOption ? selectedOption.value : ''); // Update department state to be sent to backend
    };
      
      const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
      
        const additionalData = {
          fullName,
          level,
          flatNo,
          street,
          city,
          state,
          postalCode,
          phone,
          department
        };
      
        try {
          // Save user data to local storage
          saveUserDataToLocalStorage(user, additionalData);
      
          // Send user data to backend
          await sendUserDataToBackend(user, additionalData);
      
          // Redirect to home page after completion
          navigate('/dashboard');
        } catch (err) {
          setError(err.message);
          console.error('Profile Completion Error:', err);
        } finally {
          setLoading(false);
        }
      };
      

  const handleNext = () => {
    if (validateCurrentStage()) {
      if (stage < 4) setStage(stage + 1);
    }
  };

  const handlePrevious = () => {
    if (stage > 1) setStage(stage - 1);
  };

  const validateCurrentStage = () => {
    switch (stage) {
      case 1:
        // Validate Full Name and Phone Number
        if (!fullName.trim() || !phone.trim()) {
          setError('Full Name and Phone Number are required.');
          return false;
        }
        break;
      case 2:
        // Validate Address fields
        if (!flatNo.trim() || !street.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
          setError('Complete address information is required.');
          return false;
        }
        break;
      case 3:
        // Validate Academic Information
        if (!level || !department) {
          setError('Level of Study and Department/Major are required.');
          return false;
        }
        break;
      default:
        return false;
    }
  
    setError(''); // Clear any existing errors if validation is successful
    return true;
  };
  

  return (
    <div className="complete-profile-container">
      <div className="complete-profile-card">
        {/* Step Indicator */}
        <div className="step-indicator">Step {stage} of 4</div>
        <div className="progress-bar">
          <div
            className="progress-bar-inner"
            style={{ width: `${(stage / 4) * 100}%` }} 
          ></div>
        </div>


        
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleProfileSubmit}>
          {stage === 1 && (
            <>
              {/* Stage 1: Basic Information */}
              <h2>Complete Your Profile</h2>
              <div className="input-group">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <label className="input-label">Full Name</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={user.email}
                  disabled
                />
                <label className="input-label">Email</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <label className="input-label">Phone Number</label>
              </div>
            </>
          )}
          {stage === 2 && (
            <>
            {/* Stage 2: Full Address Information */}
            <h2>Complete Your Profile</h2>
            <div className="address-row">
              <div className="input-group small-input">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  required
                />
                <label className="input-label">Flat No./Apartment</label>
              </div>
              <div className="input-group large-input">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
                <label className="input-label">Street</label>
              </div>
            </div>
            
            <div className="address-row">
              <div className="input-group small-input">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <label className="input-label">City</label>
              </div>
              <div className="input-group small-input">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
                <label className="input-label">State</label>
              </div>
              <div className="input-group small-input">
                <input
                  type="text"
                  className="complete-profile-input"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
                <label className="input-label">Postal Code</label>
              </div>
            </div>
          </>
          
            )}

          {stage === 3 && (
            <>
              {/* Stage 3: Academic Information */}
              <h2>Complete Your Profile</h2>
              <div className="input-group">
                <select
                  className="complete-profile-input"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Level of Study
                  </option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                  <option value="600">600 Level</option>
                </select>
                <label className="input-label">Level of Study</label>
              </div>
              <div className="input-group">
                <Select
                    className="complete-profile-input"
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    options={options}
                    placeholder="Select Department/Major"
                    isSearchable
                />
              </div>
            </>
          )}

          {stage === 4 && (
            <div className="confirm-details">
              <h2>Confirm Your Details</h2>
              <div className="details-list">
                <p><strong>Full Name:</strong> {fullName || user.displayName || 'Anonymous'}</p>
                <p><strong>Phone Number:</strong> {phone}</p>
                <p><strong>Address:</strong> {`${flatNo}, ${street}, ${city}, ${state}, ${postalCode}`}</p>
                <p><strong>Level:</strong> {level}</p>
                <p><strong>Department:</strong> {selectedDepartment ? selectedDepartment.label : 'Not selected'}</p>
              </div>
            </div>
          )}

            
          {/* Navigation Buttons */}
          <div className="button-group">
            {stage > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="complete-profile-button previous"
              >
                Previous
              </button>
            )}
            {stage < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="complete-profile-button"
              >
                Next
              </button>
            )}
            {stage === 4 && (
              <button
                type="submit"
                className="complete-profile-button"
                disabled={loading}
              >
                {loading ? <Loader /> : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;

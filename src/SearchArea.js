import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './Books.css';

const departments = [
  "Accountancy",
  "Adult Education",
  "Agric. & Bioresources Engineering",
  "Agric. Economics",
  "Agric. Extension",
  "Agriculture",
  "Anaesthesia",
  "Animal Health & Production",
  "Animal Science",
  "Anatomy",
  "Architecture",
  "Archaeology & Tourism",
  "Arts",
  "Arts Education",
  "Banking & Finance",
  "Biochemistry",
  "Biological Sciences",
  "Business Administration",
  "Chemical Pathology",
  "Chemistry",
  "Child Dental Health",
  "Civil Engineering",
  "Clinical Pharmacy",
  "Community Medicine",
  "Computer Education",
  "Computer Science",
  "Dentistry",
  "Dermatology",
  "Economics",
  "Education",
  "Education Foundation",
  "Electrical Engineering",
  "Electronic Engineering",
  "Engineering",
  "English & Literary Studies",
  "Environmental Studies",
  "Estate Management",
  "Fine & Applied Arts",
  "Foreign Languages",
  "Geography",
  "Geology",
  "Haematology & Immunology",
  "Health & Physical Education",
  "Health Science and Technology",
  "History & International Studies",
  "Home Economics",
  "International Law & Jurisprudence",
  "Law",
  "Library Sciences Education",
  "Linguistics & Nigerian Languages",
  "Management",
  "Marketing",
  "Mass Communication",
  "Materials & Metallurgical Engineering",
  "Mathematics",
  "Mechanical Engineering",
  "Medical Biochemistry",
  "Medical Laboratory Technology",
  "Medical Microbiology",
  "Medical Rehabilitation",
  "Medical Sciences",
  "Microbiology",
  "Morbid Anatomy",
  "Music",
  "Nursing Sciences",
  "Obstetrics & Gynaecology",
  "Ophthalmology",
  "Oral Maxillofacial Surgery",
  "Paediatric Surgery",
  "Paediatrics",
  "Performing Arts",
  "Pharmaceutical Sciences",
  "Pharmaceutics",
  "Pharmaceutical Technology",
  "Pharmacognosy",
  "Pharmacognosy and Environmental Medicines",
  "Pharmacology & Therapeutics",
  "Pharmacology and Toxicology",
  "Philosophy",
  "Physical Sciences",
  "Physics & Astronomy",
  "Physiological Medicine",
  "Plant Sciences",
  "Preventive Dentistry",
  "Property Law",
  "Psychology",
  "Public & Private Law",
  "Public Administration",
  "Pure and Industrial Chemistry",
  "Radiation Medicine",
  "Religious and Cultural Studies",
  "Restorative Dentistry",
  "Science Education",
  "Social Science Education",
  "Social Sciences",
  "Social Work",
  "Soil Science",
  "Sociology & Anthropology",
  "Statistics",
  "Surveying & Geodesy",
  "Surgery",
  "Urban & Regional Planning",
  "Veterinary Anatomy",
  "Veterinary Medicine",
  "Veterinary Obstetrics and Reproductive Diseases",
  "Veterinary Parasitology & Entomology",
  "Veterinary Pathology and Microbiology",
  "Veterinary Physiology and Pharmacology",
  "Veterinary Public Health & Preventive Medicine",
  "Veterinary Surgery",
  "Veterinary Teaching Hospital",
  "Zoology",
].sort();

const SearchArea = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleFocus = () => {
    setIsSearchActive(true);
  };

  const handleBlur = () => {
    setIsSearchActive(false);
  };

  return (
    <div className="search-area">
      <div
        className={`search-container ${isSearchActive ? 'active' : ''}`}
        onClick={handleFocus}
        onBlur={handleBlur}
      >
        <FaSearch className={`search-icon ${isSearchActive ? 'hidden' : ''}`} />
        <input
          type="text"
          className={`search-bar ${isSearchActive ? 'visible' : ''}`}
          placeholder="Search books..."
          onBlur={handleBlur}
        />
      </div>
      <select className="filter-dropdown">
        <option value="" disabled>Select Department</option>
        {departments.map(department => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchArea;

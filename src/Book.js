import React from 'react';
import './Books.css';
import SearchArea from './SearchArea';
import RecommendationArea from './RecommendationArea';
import SellBook from './SellBook';

const recentChoices = [
  {
    name: "Introduction to Algorithms",
    subject_code: "CS101",
    department: "Computer Science",
    available: true,
  },
  {
    name: "Principles of Economics",
    subject_code: "ECON101",
    department: "Economics",
    available: false,
  },
  {
    name: "Organic Chemistry",
    subject_code: "CHEM201",
    department: "Chemistry",
    available: true,
  },
];

const departmentBooks = [
  {
    name: "Advanced Calculus",
    subject_code: "MATH301",
    department: "Mathematics",
    available: true,
  },
  {
    name: "Modern Physics",
    subject_code: "PHYS401",
    department: "Physics",
    available: true,
  },
  {
    name: "Sociology: A Brief Introduction",
    subject_code: "SOC101",
    department: "Sociology",
    available: false,
  },
];

const Books = () => {
  return (
    <div className="container">
      <SearchArea />
      <RecommendationArea title="Based on your recent choices" books={recentChoices} />
      <RecommendationArea title="Based on your department" books={departmentBooks} />
      <SellBook />
    </div>
  );
};

export default Books;

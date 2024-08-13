import React, { useState } from 'react';
import './Books.css';
import SearchArea from './SearchArea';
import RecommendationArea from './RecommendationArea';
import SellBook from './SellBook';

const recentChoices = [
  { name: "Introduction to Algorithms", code: "CS101", department: "Computer Science", available: true, price: 5000.00 },
  { name: "Principles of Economics", code: "ECON101", department: "Economics", available: false, price: 3500.00 },
  { name: "Organic Chemistry", code: "CHEM201", department: "Chemistry", available: true, price: 4500.00 },
];

const departmentBooks = [
  { name: "Advanced Calculus", code: "MATH301", department: "Mathematics", available: true, price: 5500.00 },
  { name: "Modern Physics", code: "PHYS401", department: "Physics", available: true, price: 6000.00 },
  { name: "Sociology: A Brief Introduction", code: "SOC101", department: "Sociology", available: false, price: 4000.00 },
];

const allBooks = [
  { code: 'STA112', name: 'Probability II', department: 'Statistics', price: 2000, available: true, level: "100" },
  { code: 'STA111', name: 'Introduction to Probability', department: 'Statistics', price: 2500, available: true, level: "100" },
  { code: 'STA132', name: 'Inference II', department: 'Statistics', price: 3000, available: false, level: "100" },
  { code: 'STA131', name: 'Introduction to Inference', department: 'Statistics', price: 2200, available: true, level: "100" },
  { code: 'STA172', name: 'Statistical Computing', department: 'Statistics', price: 2800, available: true, level: "100" },
  { code: 'MTH122', name: 'Circle Geometry', department: 'Mathematics', price: 1800, available: true, level: "100" },
  { code: 'MTH111', name: 'Integrated Mathematics', department: 'Mathematics', price: 1500, available: false, level: "100" },
  { code: 'MTH131', name: 'Integration and Depreciation', department: 'Mathematics', price: 2000, available: true, level: "100" },
  { code: 'BIO151', name: 'Introduction to Biology', department: 'Micro Biology', price: 3000, available: true, level: "100" },
  { code: 'CHM122', name: 'Organic Chemistry II', department: 'Pure and Industrial Chemistry', price: 3500, available: true, level: "100" },
  { code: 'CHM132', name: 'Inorganic Chemistry II', department: 'Pure and Industrial Chemistry', price: 4000, available: false, level: "100" },
  { code: 'CHM171', name: 'Introduction to Organic Chemistry', department: 'Pure and Industrial Chemistry', price: 3200, available: true, level: "100" },
  { code: 'CHM101', name: 'Introduction to Inorganic Chemistry', department: 'Pure and Industrial Chemistry', price: 2800, available: true, level: "100" },
  { code: 'ENG101', name: 'Introduction to Engineering', department: 'Engineering', price: 2500, available: true, level: "100" },
  { code: 'GSP102', name: 'Lexis and Structure', department: 'General Studies', price: 1500, available: true, level: "100" },
  { code: 'GSP111', name: 'Use of Library', department: 'General Studies', price: 1000, available: false, level: "100" },
  { code: 'GSP101', name: 'Use of English', department: 'General Studies', price: 1200, available: true, level: "100" },
  { code: 'ENG102', name: 'Introduction to Engineering II', department: 'Engineering', price: 3000, available: true, level: "100" },
  { code: 'GLG142', name: 'Earth History', department: 'Geology', price: 2000, available: true, level: "100" },
  { code: 'COS101', name: 'Introduction to Computer Sciences', department: 'Computer Sciences', price: 2500, available: true, level: "100" },
  { code: 'PHY121', name: 'Physics for Engineering', department: 'Engineering', price: 2500, available: true, level: "100" },
];

// Categorizing books
const newArrivals = allBooks.slice(0, 3);
const topRatedBooks = allBooks.slice(3, 6);
const onSaleBooks = allBooks.filter(book => book.price < 2000);
const engineeringBooks = allBooks.filter(book => book.department === 'Engineering');
const scienceBooks = allBooks.filter(book => ['Physics', 'Chemistry', 'Biology'].includes(book.department));
const artsBooks = allBooks.filter(book => ['Sociology', 'General Studies'].includes(book.department));
const itBooks = allBooks.filter(book => book.department === 'Computer Sciences');
const featuredBooks = allBooks.slice(6, 9);
const mostViewedBooks = allBooks.slice(9, 12);
const popularBooks = allBooks.slice(12, 15);

const Books = ({ setCartItems }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query) => {
    if (query) {
      setIsSearching(true);
      const results = allBooks.filter(
        (book) =>
          book.name.toLowerCase().includes(query.toLowerCase()) ||
          book.code.toLowerCase().includes(query.toLowerCase()) ||
          book.department.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleAddToCart = (book) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === book.name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === book.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
  };

  return (
    <div className="container">
      <SearchArea onSearch={handleSearch} />

      {isSearching && searchResults.length > 0 ? (
        <RecommendationArea
          title="Search Results"
          books={searchResults}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <>
          <RecommendationArea
            title="Based on your recent choices"
            books={recentChoices}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="New Arrivals"
            books={newArrivals}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Top Rated"
            books={topRatedBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="On Sale"
            books={onSaleBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Engineering"
            books={engineeringBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Science"
            books={scienceBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Arts"
            books={artsBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Information Technology"
            books={itBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Featured"
            books={featuredBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Most Viewed"
            books={mostViewedBooks}
            onAddToCart={handleAddToCart}
          />
          <RecommendationArea
            title="Popular Books"
            books={popularBooks}
            onAddToCart={handleAddToCart}
          />
        </>
      )}

      <SellBook />
    </div>
  );
};

export default Books;

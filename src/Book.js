import React, { useState, useEffect } from 'react';
import './Books.css';
import axios from 'axios';
import SearchArea from './SearchArea';
import RecommendationArea from './RecommendationArea';
import SellBook from './SellBook';
import configureBaseUrl from './configureBaseUrl';
import Loaders from './Loaders';



const Books = ({ setCartItems }) => {
  const [booksData, setBooksData] = useState({
    recentChoices: [],
    newArrivals: [],
    topRatedBooks: [],
    onSaleBooks: [],
    engineeringBooks: [],
    scienceBooks: [],
    artsBooks: [],
    allBooks: [],
    itBooks: [],
    featuredBooks: [],
    mostViewedBooks: [],
    popularBooks: []
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(false)

useEffect(() => {
  const fetchBaseUrl = async () => {
    const url = configureBaseUrl();
    setBaseUrl(url);
    
  };

  fetchBaseUrl();
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${baseUrl}/findbooks`);
        const mappedData = {
          recentChoices: mapBooks(response.data.recentChoices || []),
          newArrivals: mapBooks(response.data.newArrivals || []),
          topRatedBooks: mapBooks(response.data.topRatedBooks || []),
          onSaleBooks: mapBooks(response.data.onSaleBooks || []),
          engineeringBooks: mapBooks(response.data.engineeringBooks || []),
          scienceBooks: mapBooks(response.data.scienceBooks || []),
          artsBooks: mapBooks(response.data.artsBooks || []),
          allBooks: mapBooks(response.data.allBooks || []),
          itBooks: mapBooks(response.data.itBooks || []),
          featuredBooks: mapBooks(response.data.featuredBooks || []),
          mostViewedBooks: mapBooks(response.data.mostViewedBooks || []),
          popularBooks: mapBooks(response.data.popularBooks || [])
        };
        setBooksData(mappedData);
        setLoading(false)
        localStorage.setItem('booksData', JSON.stringify(mappedData));
        setError(null);
      } catch (err) {
        setLoading(false)
        console.error("There was an error fetching the books data!", err);
        setError('Failed to fetch data from the backend.');
      }
    };

    const cachedBooksData = localStorage.getItem('booksData');
    if (cachedBooksData) {
      setBooksData(JSON.parse(cachedBooksData));
    } else {
      fetchData();
    }

    const intervalId = setInterval(fetchData, 15 * 60 * 1000); // sync every 15 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [baseUrl]);

  const mapBooks = (booksArray) => {
    return booksArray.map(book => ({
      id: book[0],
      code: book[1],
      name: book[2],
      department: book[3],
      price: parseFloat(book[4]),
      available: Boolean(book[5]),
      level: book[6],
      quantity: book[7],
      rating: book[8],
      category: book[9]
    }));
  };

  const handleSearch = (query) => {
    if (query) {
      setIsSearching(true);
      const results = booksData.allBooks.filter(
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
  if (loading) {
    return <Loaders />
  }

  if (error && booksData.allBooks.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container">
      <SearchArea onSearch={handleSearch} allBooks={booksData.allBooks} />

      {isSearching && searchResults.length > 0 ? (
        <RecommendationArea
          title="Search Results"
          books={searchResults}
          onAddToCart={handleAddToCart}
        />
      ) : isSearching && searchResults.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        <>
        {booksData.recentChoices.length > 0 ? (
          <RecommendationArea
            title="Based on your recent choices"
            books={booksData.recentChoices}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.newArrivals.length > 0 ? (
          <RecommendationArea
            title="New Arrivals"
            books={booksData.newArrivals}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.topRatedBooks.length > 0 ? (
          <RecommendationArea
            title="Top Rated"
            books={booksData.topRatedBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.onSaleBooks.length > 0 ? (
          <RecommendationArea
            title="On Sale"
            books={booksData.onSaleBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.engineeringBooks.length > 0 ? (
          <RecommendationArea
            title="Engineering"
            books={booksData.engineeringBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.scienceBooks.length > 0 ? (
          <RecommendationArea
            title="Science"
            books={booksData.scienceBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.artsBooks.length > 0 ? (
          <RecommendationArea
            title="Arts"
            books={booksData.artsBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.itBooks.length > 0 ? (
          <RecommendationArea
            title="Information Technology"
            books={booksData.itBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.featuredBooks.length > 0 ? (
          <RecommendationArea
            title="Featured"
            books={booksData.featuredBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          {booksData.mostViewedBooks.length > 0 ? (
            <RecommendationArea
            title="Most Viewed"
            books={booksData.mostViewedBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
          <>
          </>
          )}
          {booksData.popularBooks.length > 0 ? (
          <RecommendationArea
            title="Popular Books"
            books={booksData.popularBooks}
            onAddToCart={handleAddToCart}
          />
          ) : (
            <>
            </>
            )}
          <SellBook />
        </>
      )}
    </div>
  );
};

export default Books;

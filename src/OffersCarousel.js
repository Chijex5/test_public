import React, { useState, useEffect } from 'react';
import './OffersCarousel.css';

const SalesOffers = () => {
    const offers = [
      {
        id: 1,
        title: "Flash Sale",
        description: "Get 50% off on selected textbooks! Limited time only.",
        imageUrl: "https://i.imgur.com/sLVnWad.jpeg"
      },
      {
        id: 2,
        title: "New Arrivals Discount",
        description: "15% off on newly arrived books for the first week!",
        imageUrl: "https://i.imgur.com/ZNiOI8f.jpeg"
      },
      // Add more offers as needed
    ];
  
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  
    const nextOffer = () => {
      setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    };
  
    const prevOffer = () => {
      setCurrentOfferIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
    };
  
    useEffect(() => {
      const interval = setInterval(nextOffer, 5000); // Automatically switch every 5 seconds
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="sales-offers-carousel">
        <div className="offer-card">
          <img src={offers[currentOfferIndex].imageUrl} alt={offers[currentOfferIndex].title} className="offer-image" />
          <div className="offer-details">
            <h3>{offers[currentOfferIndex].title}</h3>
            <p>{offers[currentOfferIndex].description}</p>
          </div>
        </div>
        <button className="carousel-btn prev-btn" onClick={prevOffer}>❮</button>
        <button className="carousel-btn next-btn" onClick={nextOffer}>❯</button>
      </div>
    );
  };

  export default SalesOffers;

import React, { useState, useEffect } from 'react';
import book1 from './1.jfif';
import book2 from './2.jfif';
import book3 from './3.jfif';
import book4 from './4.jfif';
import book5 from './5.jfif';
import book6 from './6.jfif';
import book7 from './7.jfif';
import book8 from './8.jfif';

import './OffersCarousel.css';

const offers = [
  {
    imgSrc: book1,
    title: '50% Off Bestsellers',
    description: 'Get half off on all bestsellers this week only!',
    buttonText: 'Shop Bestsellers',
  },
  {
    imgSrc: book2,
    title: 'New Arrivals',
    description: 'Discover the latest titles in our collection.',
    buttonText: 'Browse New Arrivals',
  },
  {
    imgSrc: book3,
    title: 'Buy 2 Get 1 Free',
    description: 'Mix and match any 3 books and get the lowest-priced one free!',
    buttonText: 'Explore Offer',
  },
  {
    imgSrc: book4,
    title: 'Children’s Books',
    description: 'Special discounts on all children’s books this month.',
    buttonText: 'Shop for Kids',
  },
  {
    imgSrc: book5,
    title: 'Author of the Month',
    description: 'Save 20% on all books by our featured author.',
    buttonText: 'See Featured Author',
  },
  {
    imgSrc: book6,
    title: 'Mystery & Thriller Sale',
    description: 'Thrilling deals on all mystery and thriller titles!',
    buttonText: 'Shop Mystery',
  },
  {
    imgSrc: book7,
    title: 'Book Club Picks',
    description: 'Join our book club and get special discounts.',
    buttonText: 'Join the Club',
  },
  {
    imgSrc: book8,
    title: 'Literary Classics',
    description: 'Rediscover classic literature with a 30% discount.',
    buttonText: 'Browse Classics',
  },
];



const OfferCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {offers.map((offer, index) => (
          <div className="carousel-slide" key={index}>
            <img src={offer.imgSrc} alt={`Offer ${index + 1}`} />
            <div className="carousel-text">
              <h2>{offer.title}</h2>
              <p>{offer.description}</p>
              <button>{offer.buttonText}</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="carousel-arrows">
        <span className="arrow left" onClick={goToPrevSlide}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.9142 12L18.7071 7.20712L17.2929 5.79291L11.0858 12L17.2929 18.2071L18.7071 16.7929L13.9142 12ZM7 18V6.00001H9V18H7Z"></path>
          </svg>
        </span>
        <span className="arrow right" onClick={goToNextSlide}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.0858 12L5.29291 16.7929L6.70712 18.2071L12.9142 12L6.70712 5.79291L5.29291 7.20712L10.0858 12ZM17 6.00002L17 18H15L15 6.00002L17 6.00002Z"></path>
          </svg>
        </span>
      </div>
      <div className='cover-indicator'>
        <div className="carousel-indicators">
          {offers.map((_, index) => (
            <span
              key={index}
              className={`indicator ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferCarousel;


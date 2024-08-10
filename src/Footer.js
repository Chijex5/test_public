import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import the CSS file for styling

const Footer = ({ activeNav, setActiveNav }) => {
  return (
    <footer className="footer">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link
              to="/home"
              className={`nav-link ${activeNav === 'home' ? 'active' : ''}`}
              onClick={() => setActiveNav('home')}
            >
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              width="24"
              height="24" 
              fill="currentColor">
                <path d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM6 19H18V9.15745L12 3.7029L6 9.15745V19ZM9 9.99998H15V16H9V9.99998ZM11 12V14H13V12H11Z"></path>
              </svg>
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/book"
              className={`nav-link ${activeNav === 'book' ? 'active' : ''}`}
              onClick={() => setActiveNav('book')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-book"
              >
                <path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H14C14.5523 21 15 20.5523 15 20V15.2973L15.9995 19.9996C16.1143 20.5398 16.6454 20.8847 17.1856 20.7699L21.0982 19.9382C21.6384 19.8234 21.9832 19.2924 21.8684 18.7522L18.9576 5.0581C18.8428 4.51788 18.3118 4.17304 17.7716 4.28786L14.9927 4.87853C14.9328 4.38353 14.5112 4 14 4H10C10 3.44772 9.55228 3 9 3H4ZM10 6H13V14H10V6ZM10 19V16H13V19H10ZM8 5V15H5V5H8ZM8 17V19H5V17H8ZM17.3321 16.6496L19.2884 16.2338L19.7042 18.1898L17.7479 18.6057L17.3321 16.6496ZM16.9163 14.6933L15.253 6.86789L17.2092 6.45207L18.8726 14.2775L16.9163 14.6933Z" />
              </svg>
              <span>Books</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/cart"
              className={`nav-link ${activeNav === 'cart' ? 'active' : ''}`}
              onClick={() => setActiveNav('cart')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.00488 9H19.9433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V9ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
              </svg>
              <span>Cart</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;

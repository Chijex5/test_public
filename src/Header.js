import React from 'react';
import './Header.css';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <header className="breadcrumb-header">
      <h1>Bookshop</h1>
      <nav className="breadcrumb-nav">
        <span>Bookshop</span>
        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return isLast ? (
            <span key={to} className="breadcrumb-current"> &gt; {value.charAt(0).toUpperCase() + value.slice(1)}</span>
          ) : (
            <span key={to}> &gt; {value.charAt(0).toUpperCase() + value.slice(1)}</span>
          );
        })}
      </nav>
    </header>
  );
}

export default Header;

import React from 'react';
import './QuickLinks.css';

const QuickLinks = () => {
  const links = [
    { name: 'Your Orders', url: '/orders' },
    { name: 'Account Settings', url: '/settings' },
    { name: 'Customer Support', url: '/support' },
  ];

  return (
    <div className="quick-links">
      <h3>Quick Links</h3>
      <div className="links">
        {links.map((link, index) => (
          <a key={index} href={link.url} className="link-item">
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;

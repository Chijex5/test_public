import React, { useEffect, useState } from 'react';
import './Header.css';
import { useLocation } from 'react-router-dom';
import Deal from './uni2.png';
import Loaders from './Loaders';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import profilePic from './334.webp';
import { useUser } from './UserContext';

function Header() {
  const { userData, loading } = useUser();
  const location = useLocation();
  const [completionPercentage, setCompletionPercentage] = useState(0); // State to store completion percentage
  const pathnames = location.pathname.split('/').filter(x => x);

  useEffect(() => {
    const splitName = (fullName) => {
      if (!fullName) return { firstName: '', lastName: '' };
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      return { firstName, lastName };
    };

    const { firstName, lastName } = splitName(userData?.username);
    const address = `${userData?.flatNo || ''}, ${userData?.street || ''}, ${userData?.city || ''}, ${userData?.state || ''}`;

    const profileCompletion = {
      firstName: !!firstName,
      lastName: !!lastName,
      email: !!userData?.email,
      phone: !!userData?.phone,
      department: !!userData?.department,
      address: !!address.trim(),
    };

    const completedFields = Object.values(profileCompletion).filter(Boolean).length;
    const totalFields = Object.keys(profileCompletion).length;
    const percentage = (completedFields / totalFields) * 100;

    setCompletionPercentage(percentage); // Set the completion percentage state
  }, [userData]);

  if (loading) return <Loaders />;

  return (
    <header className="breadcrumb-header">
      <div className="container-header">
        <div className="headerss">
          <img src={Deal} alt="logo" className="logo-img" />
        </div>
        <div className='location'>
          <h1 className='header-title'>UNIBOOKS</h1>
          <nav className="breadcrumb-nav">
            <span>Unibooks</span>
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
        </div>
        <div className="profile-section">
          <Link to="/profile" className="profile-link" data-tooltip-id="profile-tooltip">
            <div className="profile-pic">
              <img src={userData?.profileUrl || profilePic} alt="Profile" className="profile-img" />
              {completionPercentage < 100 && (
                <div className="profile-completion-overlay">
                  <div className="completion-bar" style={{ width: `${completionPercentage}%` }}></div>
                  <span className="completion-text">{Math.floor(completionPercentage)}% Complete</span>
                </div>
              )}
            </div>
          </Link>
          <Tooltip id="profile-tooltip" content="View Profile" place="top" />
        </div>
      </div>
    </header>
  );
}

export default Header;

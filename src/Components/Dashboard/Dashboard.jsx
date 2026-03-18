import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GoldImage from '../../assets/gold.jpg';
import './Dashboard.css';

const Dashboard = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuActive(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  // Add effect to handle body scrolling when menu is active
  useEffect(() => {
    if (isMenuActive) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling when menu is closed
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuActive]);

  return (
    <div className="main-container">
      {/* Sidebar Section */}
      <div className={`dash-container ${isMenuActive ? 'active' : ''}`}>
        <div className="top-contain">
          <Link to="/dashboard" onClick={() => setIsMenuActive(false)}>
            <img 
              src={GoldImage} 
              alt="Clickable image"
              style={{ cursor: 'pointer' }}
            />
          </Link>
          <h2>AltCare PVT LTD</h2>
        </div>
        <hr />
        <div className="modules-container">
          {[ 
            { icon: 'fa-house', label: 'Home', path: '/dashboard/home' },
            { icon: 'fa-user-tie', label: 'MasterEntry', path: '/dashboard/connections' },
            { icon: 'fa-warehouse', label: 'Inventory', path: '/dashboard/inventory' },
            { icon: 'fa-business-time', label: 'Accounts'},
            { icon: 'fa-person', label: 'Reports'},
          ].map((module, index) => (
            <div className="module" key={index}>
              <i className={`fa-solid ${module.icon}`}></i>
              <Link to={module.path} onClick={() => setIsMenuActive(false)}>
                {module.label}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <hr />
          <p className='name'>Copyright © 2025</p>
          <p className='tag'>AltCare Private Limited.</p>
          <p className='name'>All rights reserved</p>
        </div>
      </div>
      
      {/* Mobile Menu Toggle Button - Moved after sidebar for better z-index stacking */}
      <button 
        className={`menu-toggle ${isMenuActive ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className="hamburger"></div>
      </button>
    </div>
  );
};

export default Dashboard;

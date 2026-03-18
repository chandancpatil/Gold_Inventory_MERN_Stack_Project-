import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard'; // Import the sidebar component
import './Layout.css';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);
  
  return (
    <div className="layout-container">
      <div className={`dashboard ${isMobileMenuOpen ? 'show' : ''}`}>
        <Dashboard /> {/* Fixed sidebar */}
      </div>
      
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
      
      <div className="main-content">
        <Outlet /> {/* This will render the nested routes (Home, Connections, etc.) */}
      </div>
    </div>
  );
};

export default Layout;
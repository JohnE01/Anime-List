import React, { useState } from 'react';
import { FaBars, FaHome, FaServicestack, FaUserFriends, FaEnvelope } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={toggleSidebar} className="toggle-button">
        <FaBars />
      </button>
      <div className="sidebar-content">
        {isOpen && (
          <>
            <a href="#home" className="sidebar-item">
              <FaHome className="icon" /> Home
            </a>
            <a href="#services" className="sidebar-item">
              <FaServicestack className="icon" /> Services
            </a>
            <a href="#clients" className="sidebar-item">
              <FaUserFriends className="icon" /> Clients
            </a>
            <a href="#contact" className="sidebar-item">
              <FaEnvelope className="icon" /> Contact
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

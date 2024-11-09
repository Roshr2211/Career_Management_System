// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png'; // Adjust path if necessary
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="PathForge Logo" className="logo" />
        <h1>PathForge</h1>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        
      </nav>
    </header>
  );
};

export default Header;

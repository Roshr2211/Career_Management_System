// components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-links">
      <div className="dashboard-box">
          <Link to="/student-profile">Student Profile</Link>
        </div>
        <div className="dashboard-box">
          <Link to="/student-registration">Student Registration</Link>
        </div>


        <div className="dashboard-box">
          <Link to="/academic-performance">Academic Perfomance</Link>
        </div>


        <div className="dashboard-box">
          <Link to="/additional_info">Additional Info</Link>
        </div>
        <div className="dashboard-box">
          <Link to="/companies">Companies</Link>
        </div>
        <div className="dashboard-box">
          <Link to="/JobListings">Job Listings</Link>
        </div>
        <div className="dashboard-box">
          <Link to="/projects">Projects</Link>
        </div>
        <div className="dashboard-box">
          <Link to="/skills">Skills</Link>
        </div>
        <div className="dashboard-box">
          <Link to="/companies">Companies Info</Link>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;

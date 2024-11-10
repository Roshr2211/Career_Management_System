import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Briefcase, DollarSign, Building, FileText } from 'lucide-react';

const CustomAlert = ({ message, type, onClose }) => (
  <div className={`alert-container ${type === 'error' ? 'alert-error' : 'alert-success'}`}>
    <span>{message}</span>
    <button onClick={onClose} className="alert-close-btn">
      <X size={16} />
    </button>
  </div>
);

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    job_title: '',
    job_description: '',
    expected_salary: '',
    company_id: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching jobs');
      setLoading(false);
      showAlert('Error fetching jobs', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/jobs', formData);
      fetchJobs();
      setFormData({
        job_title: '',
        job_description: '',
        expected_salary: '',
        company_id: ''
      });
      showAlert('Job listing created successfully!', 'success');
    } catch (err) {
      showAlert('Error creating job listing', 'error');
    }
  };

  const addJobListing = () => {
    setFormData({
      job_title: '',
      job_description: '',
      expected_salary: '',
      company_id: ''
    });
  };

  return (
    <div className="job-listings-container">
      <h2>Job Listings</h2>

      {/* Custom Alert Component */}
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: '' })}
        />
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="job-card">
          <div className="input-group">
            <label>Job Title:</label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              placeholder="Enter job title"
              required
            />
          </div>
          <div className="input-group">
            <label>Job Description:</label>
            <input
              type="text"
              name="job_description"
              value={formData.job_description}
              onChange={handleInputChange}
              placeholder="Enter job description"
              required
            />
          </div>
          <div className="input-group">
            <label>Expected Salary:</label>
            <input
              type="text"
              name="expected_salary"
              value={formData.expected_salary}
              onChange={handleInputChange}
              placeholder="Enter expected salary"
              required
            />
          </div>
          <div className="input-group">
            <label>Company ID:</label>
            <input
              type="text"
              name="company_id"
              value={formData.company_id}
              onChange={handleInputChange}
              placeholder="Enter company ID"
              required
            />
          </div>
          <button type="submit" className="submit-job-button">
            Submit Job Listing
          </button>
        </div>
      </form>

      <button className="add-job-button" onClick={addJobListing}>
        Add New Job Listing
      </button>

      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.job_id} className="job-listing-card">
            <div className="job-header">
              <div className="job-title-section">
                <Briefcase className="icon" />
                <h3>{job.job_title}</h3>
              </div>
              <span className="company-badge">
                <Building className="icon" />
                Company ID: {job.company_id}
              </span>
            </div>
            
            <div className="job-content">
              <div className="job-description">
                <FileText className="icon" />
                <p>{job.job_description}</p>
              </div>
              
              <div className="job-salary">
                <DollarSign className="icon" />
                <span>{job.expected_salary}</span>
              </div>
            </div>
            
            <div className="job-footer">
              <button className="apply-button">Apply Now</button>
              <button className="save-button">Save Job</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListings;
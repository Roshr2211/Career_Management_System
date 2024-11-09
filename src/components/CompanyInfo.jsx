import React, { useState } from 'react';
import './CompanyInfo.css';

const CompanyInfo = () => {
  const [companyDetails, setCompanyDetails] = useState({
    companyId: '',
    companyName: '',
    industry: '',
    companyDescription: '',
    companyImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyDetails(prevState => ({
        ...prevState,
        companyImage: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object
    const formData = new FormData();
    formData.append('companyId', companyDetails.companyId);
    formData.append('companyName', companyDetails.companyName);
    formData.append('industry', companyDetails.industry);
    formData.append('companyDescription', companyDetails.companyDescription);
    
    // Only append image if it exists
    if (companyDetails.companyImage) {
      formData.append('companyImage', companyDetails.companyImage);
    }

    try {
      const response = await fetch('http://localhost:5001/companies', {
        method: 'POST',
        body: formData, // Don't set Content-Type header - browser will set it with boundary
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Company added successfully!');
        // Reset form
        setCompanyDetails({
          companyId: '',
          companyName: '',
          industry: '',
          companyDescription: '',
          companyImage: null,
        });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        alert(`Error: ${data.error || 'Failed to add company'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding company: ' + error.message);
    }
  };

  return (
    <div className="company-info-container">
      <h1>Company Information</h1>
      <form onSubmit={handleSubmit} className="company-info-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="companyId">Company ID:</label>
          <input
            type="text"
            id="companyId"
            name="companyId"
            value={companyDetails.companyId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={companyDetails.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="industry">Industry:</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={companyDetails.industry}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyDescription">Company Description:</label>
          <textarea
            id="companyDescription"
            name="companyDescription"
            value={companyDetails.companyDescription}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="companyImage">Company Image:</label>
          <input
            type="file"
            id="companyImage"
            name="companyImage"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {companyDetails.companyName && (
        <div className="company-details-display">
          <h2>Company Details</h2>
          <div className="company-info-box">
            {companyDetails.companyImage && (
              <img
                src={URL.createObjectURL(companyDetails.companyImage)}
                alt={companyDetails.companyName}
                className="company-image"
              />
            )}
            <div className="company-info-text">
              <p><strong>Company ID:</strong> {companyDetails.companyId}</p>
              <p><strong>Company Name:</strong> {companyDetails.companyName}</p>
              <p><strong>Industry:</strong> {companyDetails.industry}</p>
              <p><strong>Description:</strong> {companyDetails.companyDescription}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInfo;
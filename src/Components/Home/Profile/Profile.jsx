import React, { useState, useEffect } from 'react';
import { database } from "../../../firebase"; // Adjusted import path
import { ref, set, onValue } from "firebase/database";
import './Profile.css';

export default function CompanyInfo() {
    const [companyDetails, setCompanyDetails] = useState({
        cname: '',
        cemail: '',
        cdescription: '',
        caddress: '',
        cphone: '',
        cwebsite: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const starCountRef = ref(database, 'Admin/CompanyDetails');
        
        const unsubscribe = onValue(starCountRef, (snapshot) => {
            try {
                if (snapshot.exists()) {
                    setCompanyDetails(snapshot.val());
                }
                setLoading(false);
            } catch (err) {
                setError("Failed to load company details");
                setLoading(false);
                console.error(err);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await set(ref(database, 'Admin/CompanyDetails'), companyDetails);
            alert('Company details updated successfully');
        } catch (error) {
            setError('Error updating company details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
      return (
          <div className="company-info-loading">
              {/* Spinner is created via CSS pseudo-element */}
          </div>
      );
  }
  if (error) {
    return (
        <div className="company-info-error">
            {error}
            <button onClick={() => setError(null)}>Try Again</button>
        </div>
    );
}

    return (
        <div className="card border-secondary mb-3" style={{ marginInline: "8rem", marginTop: "2rem" }}>
            <div className="pcard-header">Company Profile</div>
            <div className="card-body text-secondary">
                <form onSubmit={alert}>
                    <div className="mb-3">
                        <label htmlFor="cname" className="form-label">Company Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="cname" 
                            name="cname" 
                            value={companyDetails.cname}
                            onChange={handleChange}
                            placeholder="Enter company name.." 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cemail" className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="cemail" 
                            name="cemail" 
                            value={companyDetails.cemail}
                            onChange={handleChange}
                            placeholder="Enter company email.." 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cdescription" className="form-label">Description</label>
                        <textarea 
                            className="form-control" 
                            id="cdescription" 
                            name="cdescription" 
                            rows="3" 
                            value={companyDetails.cdescription}
                            onChange={handleChange}
                            placeholder="Enter company description.." 
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="caddress" className="form-label">Address</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="caddress" 
                            name="caddress" 
                            value={companyDetails.caddress}
                            onChange={handleChange}
                            placeholder="Enter address.." 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cphone" className="form-label">Phone Number</label>
                        <input 
                            type="tel" 
                            className="form-control" 
                            id="cphone" 
                            name="cphone" 
                            value={companyDetails.cphone}
                            onChange={handleChange}
                            placeholder="Enter phone number.." 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cwebsite" className="form-label">Website</label>
                        <input 
                            type="url" 
                            className="form-control" 
                            id="cwebsite" 
                            name="cwebsite" 
                            value={companyDetails.cwebsite}
                            onChange={handleChange}
                            placeholder="Enter website URL.." 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </form>
                <p className="card-text my-2">Company information form.</p>
            </div>
        </div>
    );
}